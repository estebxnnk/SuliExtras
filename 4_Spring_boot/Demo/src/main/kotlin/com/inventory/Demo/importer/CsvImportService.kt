package com.inventory.Demo.importer

import com.inventory.Demo.modulos.Sede.model.Sede
import com.inventory.Demo.modulos.Area.model.Area
import com.inventory.Demo.modulos.Empleado.model.Empleado
import com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Computador
import com.inventory.Demo.modulos.Sede.service.SedeService
import com.inventory.Demo.modulos.Area.service.AreaService
import com.inventory.Demo.modulos.Empleado.service.EmpleadoService
import com.inventory.Demo.modulos.Dispositivo.service.DispositivoService
import com.opencsv.CSVReaderBuilder
import org.springframework.stereotype.Service
import java.io.FileReader
import java.time.LocalDate
import java.time.format.DateTimeFormatter

fun String?.toNullIfNA(): String? =
    if (this == null || this.trim().equals("N.A.", ignoreCase = true) || this.trim().isBlank()) null else this.trim()

@Service
class CsvImportService(
    private val sedeService: SedeService,
    private val areaService: AreaService,
    private val empleadoService: EmpleadoService,
    private val dispositivoService: DispositivoService
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
        try {
            for (i in 1 until filas.size) { // Salta el header
                val fila = filas[i]
                val item = fila[0].toNullIfNA()//s
                val sedeNombre = fila[1]//s
                val areaClase = fila[2]//s
                val areaNombre = fila[3]//s
                val areaProceso = fila[4]//s
                val areaCanal = fila[5]//s
                val areaSubCanal = fila[6]//s
                val empleadoDocumento = fila[7]
                val empleadoNombre = fila[8]
                val empleadoCargo = fila[9]
                val empleadoEmail = fila[10].toNullIfNA()
                val tipo = fila[11].toNullIfNA()//s
                val clasificacion = fila[13]//s
                val marca = fila[14].toNullIfNA()//s
                val modelo = fila[15].toNullIfNA()//s
                val serial = fila[16].toNullIfNA()//s
                val procesador = fila[19].toNullIfNA()//19
                val ram = fila[20].toNullIfNA()//20
                val almacenamiento = fila[21].toNullIfNA()//22
                val almacenamiento2 = fila[22].toNullIfNA()
                val mac = fila[23].toNullIfNA()
                val ip = fila[24].toNullIfNA()
                val estado = fila[26]//s
                val fechaAdquisicion = fila[28]//s
                val costo = fila[30]
                val nombreEquipo = fila[31].toNullIfNA()//31
                val sistemaOperativo = fila[32].toNullIfNA()//32
                val ofimatica = fila[33].toNullIfNA()//33
                val antivirus = fila[34].toNullIfNA()//34
                val softwareAdicional = fila[30].toNullIfNA()//30
                val observaciones = fila[52].toNullIfNA()//s

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

                val empleado = empleadoService.findByDocumento(empleadoDocumento)
                    ?: empleadoService.save(
                        Empleado(
                            documentoIdentidad = empleadoDocumento,
                            nombreCompleto = empleadoNombre,
                            cargo = empleadoCargo,
                            email = empleadoEmail,
                            area = area
                        )
                    )

                val fechaAdq = try {
                    if (fechaAdquisicion.isNotBlank()) LocalDate.parse(fechaAdquisicion, DateTimeFormatter.ofPattern("d/M/yyyy")) else null
                } catch (e: Exception) { null }
                val costoEquipo = costo.toDoubleOrNull()

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
                    dispositivoService.save(
                        Computador(
                            nombreEquipo = nombreEquipo,
                            procesador = procesador,
                            ram = ram,
                            almacenamiento = almacenamiento,
                            almacenamiento2 = almacenamiento2,
                            mac = mac,
                            ip = ip,
                            ofimatica = ofimatica,
                            antivirus = antivirus,
                            sistemaOperativo = sistemaOperativo,
                            softwareAdicional = softwareAdicional,
                            item = item,
                            serial = serial,
                            modelo = modelo,
                            marca = marca,
                            categoria = null,
                            sede = sede,
                            estado = com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo.DISPONIBLE,
                            fechaAdquisicion = fechaAdq,
                            costo = costoEquipo,
                            codigoActivo = null,
                            tipo = tipo,
                            clasificacion = clasificacion,
                            observaciones = observaciones
                        )
                    )
                    insertados++
                } catch (ex: Exception) {
                    erroresReporte.add("[ERROR] Fallo al insertar línea ${i + 1}: ${ex.message}. Item: '${item}', Serial: '${serial}', Fila: ${fila.joinToString(";")}")
                }
            }
        } catch (ex: Exception) {
            println("Error durante la importación: ${ex.message}")
        } finally {
            println("Importación finalizada: $insertados dispositivos insertados, $duplicados duplicados ignorados.")
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
        }
        reader.close()
    }
} 