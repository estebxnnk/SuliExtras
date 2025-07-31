package com.inventory.Demo.importer

import com.inventory.Demo.modulos.Sede.model.Sede
import com.inventory.Demo.modulos.Area.model.Area
import com.inventory.Demo.modulos.Empleado.model.Empleado
import com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Celular
import com.inventory.Demo.modulos.Sede.service.SedeService
import com.inventory.Demo.modulos.Area.service.AreaService
import com.inventory.Demo.modulos.Empleado.service.EmpleadoService
import com.inventory.Demo.modulos.Dispositivo.service.DispositivoService
import com.inventory.Demo.modulos.Asignacion.service.AsignacionService
import com.opencsv.CSVReaderBuilder
import org.springframework.stereotype.Service
import java.io.FileReader
import java.time.LocalDate
import java.time.format.DateTimeFormatter

// Método auxiliar para normalizar el tipo de dispositivo
fun String?.toTipoDiscriminadorCelular(): String {
    val normalizado = this
        ?.trim()
        ?.lowercase()
        ?.replace("á", "a")
        ?.replace("é", "e")
        ?.replace("í", "i")
        ?.replace("ó", "o")
        ?.replace("ú", "u")
        ?: ""
    return when {
        normalizado.contains("celular") || normalizado.contains("movil") -> "CELULAR"
        else -> this?.trim()?.uppercase() ?: ""
    }
}

@Service
class CsvImportServiceCelulares(
    private val sedeService: SedeService,
    private val areaService: AreaService,
    private val empleadoService: EmpleadoService,
    private val dispositivoService: DispositivoService,
    private val asignacionService: AsignacionService,
) {
    fun importarDesdeCsv(rutaArchivo: String) {
        val reader = CSVReaderBuilder(FileReader(rutaArchivo)).withCSVParser(
            com.opencsv.CSVParserBuilder().withSeparator(';').build()
        ).build()
        val filas = reader.readAll()
        var insertados = 0
        var duplicados = 0
        val serialesDuplicados = mutableListOf<String>()
        var ignoradosSerialVacio = 0
        val erroresReporte = mutableListOf<String>()
        val empleadosInsertados = mutableListOf<String>()
        val empleadosExistentes = mutableListOf<String>()
        try {
            for (i in 1 until filas.size) { // Salta el header
                val fila = filas[i]
                val item = fila[0].toNullIfNA()
                val sedeNombre = fila[1]
                val areaClase = fila[2]
                val areaNombre = fila[3]
                val areaProceso = fila[4]
                val areaCanal = fila[5]
                val areaSubCanal = fila[6]
                val empleadoDocumento = fila[7]
                val empleadoNombre = fila[8]
                val empleadoCargo = fila[9]
                val empleadoEmail = fila[10].toNullIfNA()
                val tipo = fila[11].toNullIfNA()
                val numeroCelular = fila[12].toNullIfNA()
                val clasificacion = fila[13]
                val marca = fila[14].toNullIfNA()
                val modelo = fila[15].toNullIfNA()
                val serial = fila[16].toNullIfNA()
                val imei1 = fila[17]
                val imei2 = fila[18]
                val procesador = fila[19].toNullIfNA()
                val ram = fila[20].toNullIfNA()
                val almacenamiento = fila[21].toNullIfNA()
                val tenable = fila[35].toBooleanSi()
                val cuentaGmailActual = fila[23]//.toNullIfNA()
                val contrasenaGmailActual = fila[24]//.toNullIfNA()
                val cuentaGmailAnterior = fila[25]//.toNullIfNA()
                val contrasenaGmailAnterior = fila[26]//.toNullIfNA()
                val ofimatica = fila[33].toNullIfNA()//33
                val sistemaOperativoMovil = fila[32].toNullIfNA()
                // Ajuste: estado está en la posición 29
                val estadoRaw = fila.getOrNull(29)?.toNullIfNA() ?: "DISPONIBLE"
                val estado = try {
                    com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo.valueOf(estadoRaw.uppercase())
                } catch (e: Exception) {
                    println("[ERROR] Estado inválido en línea ${i + 1}: '$estadoRaw'. Usando DISPONIBLE por defecto.")
                    com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo.DISPONIBLE
                }
                val fechaAdquisicion = fila[28]//.getOrNull(30)?.toNullIfNA()//28
                val costo = fila.getOrNull(31)?.toNullIfNA()?.toDoubleOrNull()
                val funcional = fila[27].toBooleanFuncional()//s
                val observaciones = fila[34]//.getOrNull(34)?.toNullIfNA()

                val sede = sedeService.findByNombre(sedeNombre)
                    ?: sedeService.save(Sede(nombre = sedeNombre, ubicacion = "", ciudad = ""))

                val area = areaService.findByNombreAndSede(areaNombre, sede)
                    ?: areaService.save(
                        Area(
                            nombre = areaNombre,
                            clase = areaClase,
                            proceso = areaProceso,
                            canal = areaCanal,
                            subCanal = areaSubCanal,
                            sede = sede
                        )
                    )

                // Empleado: registrar si es nuevo o existente
                val empleadoExistente = empleadoService.findByDocumento(empleadoDocumento)
                val empleado = empleadoExistente
                    ?: empleadoService.save(
                        Empleado(
                            documentoIdentidad = empleadoDocumento,
                            nombreCompleto = empleadoNombre,
                            cargo = empleadoCargo,
                            email = empleadoEmail,
                            telefono = numeroCelular,
                            area = area
                        )
                    )
                if (empleadoExistente != null) {
                    empleadosExistentes.add("[EXISTENTE] Línea ${i + 1}: $empleadoDocumento - $empleadoNombre")
                } else {
                    empleadosInsertados.add("[NUEVO] Línea ${i + 1}: $empleadoDocumento - $empleadoNombre")
                }

                val fechaAdq = try {
                    if (!fechaAdquisicion.isNullOrBlank()) LocalDate.parse(fechaAdquisicion, DateTimeFormatter.ofPattern("d/M/yyyy")) else null
                } catch (e: Exception) { null }

                // Validación serial vacío/nulo
                if (serial.isNullOrBlank() || serial.equals("N.A.", ignoreCase = true)) {
                    ignoradosSerialVacio++
                    erroresReporte.add("[ADVERTENCIA] Línea ${i + 1} ignorada: serial vacío o nulo. Item: '${item}', Serial: '${serial}', Fila: ${fila.joinToString(";")}")
                    continue
                }

                // Validación duplicado
                val existente = dispositivoService.findBySerial(serial)
                if (existente != null) {
                    duplicados++
                    serialesDuplicados.add(serial)
                    erroresReporte.add("[DUPLICADO] Línea ${i + 1} ignorada: serial duplicado. Item: '${item}', Serial: '${serial}', Fila: ${fila.joinToString(";")}")
                    continue
                }

                // Intento de inserción
                try {
                    val celular = dispositivoService.save(
                        Celular(
                            imei1 = imei1,
                            imei2 = imei2,
                            procesador = procesador,
                            ram = ram,
                            almacenamiento = almacenamiento,
                            tenable = tenable,
                            cuentaGmailActual = cuentaGmailActual,
                            contrasenaGmailActual = contrasenaGmailActual,
                            cuentaGmailAnterior = cuentaGmailAnterior,
                            contrasenaGmailAnterior = contrasenaGmailAnterior,
                            ofimatica = ofimatica,
                            sistemaOperativoMovil = sistemaOperativoMovil,
                            item = item,
                            serial = serial,
                            modelo = modelo,
                            marca = marca,
                            categoria = null,
                            sede = sede,
                            estado = estado,
                            clasificacion = clasificacion ?: "",
                            fechaAdquisicion = fechaAdq,
                            costo = costo,
                            funcional = funcional,
                            codigoActivo = null,
                            tipo = tipo.toTipoDiscriminadorCelular(),
                            observaciones = observaciones
                        )
                    )
                    insertados++
                    asignacionService.create(
                        com.inventory.Demo.modulos.Asignacion.dto.AsignacionRequest(
                            dispositivoId = celular.dispositivoId,
                            empleadoId = empleado.id!!,
                            sedeId = sede.id!!,
                            areaId = area.id!!,
                            fechaAsignacion = fechaAdq ?: LocalDate.now(),
                            comentario = "Asignación automática por importación de celulares",
                            observaciones = observaciones,
                            accesorios = null
                        )
                    )
                } catch (ex: Exception) {
                    erroresReporte.add("[ERROR] Fallo al insertar línea ${i + 1}: ${ex.message}. Item: '${item}', Serial: '${serial}', Fila: ${fila.joinToString(";")}")
                }
            }
        } catch (ex: Exception) {
            println("Error durante la importación: ${ex.message}")
        } finally {
            println("\n================= REPORTE FINAL DE IMPORTACIÓN =================")
            println("Celulares insertados exitosamente: $insertados")
            println("Duplicados ignorados: $duplicados")
            println("Registros ignorados por serial vacío/nulo: $ignoradosSerialVacio")
            val totalErrores = erroresReporte.size
            println("Errores de importación: $totalErrores")
            val totalProcesados = filas.size - 1 // menos el header
            val totalNoInsertados = duplicados + ignoradosSerialVacio + totalErrores
            println("Total de filas procesadas: $totalProcesados")
            println("Total de filas NO insertadas: $totalNoInsertados")
            println("Total de filas insertadas: $insertados")
            if (serialesDuplicados.isNotEmpty()) {
                println("Seriales duplicados ignorados:")
                serialesDuplicados.forEach { println(it) }
            }
            if (erroresReporte.isNotEmpty()) {
                println("\n================= REPORTE DE REGISTROS NO INGRESADOS =================")
                erroresReporte.forEach { println(it) }
                println("====================================================================\n")
            }
            // Reporte de empleados
            println("\n================= REPORTE DE EMPLEADOS =================")
            println("Empleados insertados: ${empleadosInsertados.size}")
            empleadosInsertados.forEach { println(it) }
            println("Empleados ya existentes: ${empleadosExistentes.size}")
            empleadosExistentes.forEach { println(it) }
            println("====================================================================\n")
        }
        reader.close()
    }
}
