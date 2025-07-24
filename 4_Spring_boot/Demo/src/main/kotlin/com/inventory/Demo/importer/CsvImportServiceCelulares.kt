// TEMPORALMENTE DESHABILITADO POR MANTENIMIENTO: No ejecutar hasta resolver conflictos en CsvImportService.kt
/*
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
import com.inventory.Demo.modulos.Asignacion.dto.AsignacionRequest
import com.opencsv.CSVReaderBuilder
import org.springframework.stereotype.Service
import java.io.FileReader
import java.time.LocalDate
import java.time.format.DateTimeFormatter

@Service
class CsvImportServiceCelulares(
    private val sedeService: SedeService,
    private val areaService: AreaService,
    private val empleadoService: EmpleadoService,
    private val dispositivoService: DispositivoService,
    private val asignacionService: AsignacionService
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
        val celularesInsertados = mutableListOf<String>()
        val celularesFallidos = mutableListOf<String>()
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
                val imei1 = fila[17].toNullIfNA()
                val imei2 = fila[18].toNullIfNA()
                val procesador = fila[19].toNullIfNA()
                val ram = fila[20].toNullIfNA()
                val almacenamiento = fila[21].toNullIfNA()
                val almacenamiento2 = fila[22].toNullIfNA()
                val ofimatica = fila[23].toNullIfNA()
                val funcional = fila[27].toBooleanSi()
                val tenable =fila[35].toBooleanSi()
                val sistemaOperativo = fila[31].toNullIfNA() ?: fila[29].toNullIfNA() // Android, etc.
                val estado = fila[28]
                val fechaAdquisicion = fila[29]
                val costo = fila[30]
                val observaciones = fila[42].toNullIfNA()

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
                    if (fechaAdquisicion.isNotBlank()) LocalDate.parse(fechaAdquisicion, DateTimeFormatter.ofPattern("d/M/yyyy")) else null
                } catch (e: Exception) { null }
                val costoEquipo = costo.toDoubleOrNull()

                // Validación serial vacío/nulo
                if (serial.isNullOrBlank() || serial.equals("N.A.", ignoreCase = true)) {
                    ignoradosSerialVacio++
                    erroresReporte.add("[ADVERTENCIA] Línea ${i + 1} ignorada: serial vacío o nulo. Item: '${item}', Serial: '${serial}', Fila: ${fila.joinToString(";")}")
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
                            imei1 = imei1 ?: "",
                            imei2 = imei2,
                            procesador = procesador,
                            ram = ram,
                            almacenamiento = almacenamiento,
                            almacenamiento2 = almacenamiento2,
                            sistemaOperativoMovil = sistemaOperativo,
                            ofimatica = ofimatica,
                            tenable = tenable,
                            emailAsociado = empleadoEmail,
                            contrasenaEmail = null,
                            capacidadSim = null,
                            item = item,
                            serial = serial,
                            modelo = modelo,
                            marca = marca,
                            categoria = null,
                            sede = sede,
                            estado = com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo.DISPONIBLE,
                            funcional = funcional,
                            clasificacion = clasificacion,
                            fechaAdquisicion = fechaAdq,
                            costo = costoEquipo,
                            codigoActivo = null,
                            tipo = tipo,
                            observaciones = observaciones
                        )
                    )
                    insertados++
                    celularesInsertados.add("[OK] Línea ${i + 1}: Serial $serial, IMEI1: ${imei1}, Empleado: $empleadoDocumento - $empleadoNombre")
                    // Crear la asignación con el empleado
                    if (empleado.id != null && sede.id != null && area.id != null) {
                        try {
                            asignacionService.create(
                                AsignacionRequest(
                                    dispositivoId = celular.dispositivoId,
                                    empleadoId = empleado.id!!,
                                    sedeId = sede.id!!,
                                    areaId = area.id!!,
                                    fechaAsignacion = fechaAdq ?: LocalDate.now(),
                                    comentario = "Asignación automática por importación de celulares",
                                    observaciones = observaciones
                                )
                            )
                        } catch (ex: Exception) {
                            val msg = "[ERROR ASIGNACIÓN] Línea ${i + 1}: ${ex.message}. Serial: '${serial}', Empleado: '${empleadoDocumento}'"
                            erroresReporte.add(msg)
                            celularesFallidos.add(msg)
                        }
                    }
                } catch (ex: Exception) {
                    val msg = "[ERROR] Fallo al insertar línea ${i + 1}: ${ex.message}. Item: '${item}', Serial: '${serial}', Fila: ${fila.joinToString(";")}"
                    erroresReporte.add(msg)
                    celularesFallidos.add(msg)
                }
            }
        } catch (ex: Exception) {
            println("Error durante la importación: ${ex.message}")
        } finally {
            println("Importación finalizada: $insertados celulares insertados, $duplicados duplicados ignorados.")
            println("Registros ignorados por serial vacío/nulo: $ignoradosSerialVacio")
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
            // Reporte de celulares
            println("\n================= REPORTE DE CELULARES =================")
            println("Celulares insertados: ${celularesInsertados.size}")
            celularesInsertados.forEach { println(it) }
            println("Celulares fallidos: ${celularesFallidos.size}")
            celularesFallidos.forEach { println(it) }
            println("====================================================================\n")
        }
        reader.close()
    }
}
*/
