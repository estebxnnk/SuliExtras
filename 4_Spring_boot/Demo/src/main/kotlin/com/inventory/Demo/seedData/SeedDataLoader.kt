package com.inventory.Demo.seedData

import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component
import com.inventory.Demo.modulos.Dispositivo.service.DispositivoService
import com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo
import com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.*
import java.time.LocalDate
import com.inventory.Demo.modulos.Area.service.AreaService
import com.inventory.Demo.modulos.Empleado.service.EmpleadoService
import com.inventory.Demo.modulos.Area.model.Area
import com.inventory.Demo.modulos.Empleado.model.Empleado
import com.inventory.Demo.modulos.Sede.service.SedeService
import com.inventory.Demo.modulos.Sede.model.Sede
import com.inventory.Demo.modulos.Accesorio.service.AccesorioService
import com.inventory.Demo.modulos.Accesorio.model.Accesorio
import com.inventory.Demo.modulos.Asignacion.service.AsignacionService
import com.inventory.Demo.modulos.Asignacion.dto.AsignacionRequest
import com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.MantenimientoEntry

// @Component
class SeedDataLoader(
    private val dispositivoService: DispositivoService,
    private val areaService: AreaService,
    private val empleadoService: EmpleadoService,
    private val sedeService: SedeService,
    private val accesorioService: AccesorioService, // <--- Inyección del servicio de accesorios
    private val asignacionService: AsignacionService // <--- Inyección del servicio de asignaciones
) : CommandLineRunner {
    override fun run(vararg args: String?) {
        if (areaService.findAll().isNotEmpty() || empleadoService.findAll().isNotEmpty()) {
            // Ya hay datos, no volver a sembrar
            return
        }
        // Sedes
        val sede1 = sedeService.save(Sede(
            nombre = "SULICOR : BOGOTA : COASMEDAS",
            ubicacion = "Calle 100 #45-67",
            ciudad = "Bogotá"
        ))
        // Áreas
        val area1 = areaService.save(Area(
            nombre = "GERENCIA : GENERAL : 430 AUDITORIA",
            clase = "CANALES DE DISTRIBUCION : SULICOR : 1000 SULICOR",
            proceso = "Fiananciera",
            canal = "Auditoria",
            subCanal = "N/A",
            sede = sede1
        ))
        // Empleados
        val empleado1 = empleadoService.save(Empleado(
            documentoIdentidad = "1001066754",
            nombreCompleto = "Santiago Diaz Dominguez",
            cargo = "Analista de Auditoria",
            email = "santiago.diaz@auditoresyrevisoresfiscalesls.com",

            telefono = "3001234567",
            lineaCorporativa = "N/A",
            area = area1
        ))
        // Videobeam
        if (dispositivoService.findAll().none { it.serial == "2WKKT93" }) {
            dispositivoService.save(Videobeam(
                item = "ACTICO/035",
                tipoConexion = "HDMI/VGA",
                resolucionNativa = "1920x1080",
                serial = "2WKKT93",
                modelo = "Latitude 3420",
                marca = "DELL",
                categoria = null,
                sede = sede1,
                estado = EstadoDispositivo.BAJA,
                clasificacion = if (EstadoDispositivo.DISPONIBLE == EstadoDispositivo.BAJA) "OBSOLETO" else "BAJA",
                fechaAdquisicion = LocalDate.parse("2023-01-10"),
                costo = 1200000.0,
                funcional = false,
                codigoActivo = "ACT-VB-001",
                tipo = "VIDEOBEAM",
                observaciones = "Videobeam para sala A",
            ))
        }
        // Computador
        if (dispositivoService.findAll().none { it.serial == "2WKKT93" }) {
            val mantenimientosEjemplo = listOf(
                MantenimientoEntry(
                    fecha = LocalDate.parse("2023-06-01"),
                    mantenimientoRealizado = true,
                    observacion = "Cambio de disco duro"
                ),
                MantenimientoEntry(
                    fecha = LocalDate.parse("2024-01-15"),
                    mantenimientoRealizado = false,
                    observacion = null
                )
            )
            dispositivoService.save(Computador(
                nombreEquipo = "Destkpo/123",
                procesador = "Intel core i5 G11",
                ram = "8GB",
                almacenamiento = "N/A",
                almacenamiento2 = "480Gb",
                mac = "0",
                ip = "192.168.1.10",
                ofimatica = "Office 2019",
                antivirus = "Ninguno",
                sistemaOperativo = "Windows 10",
                softwareAdicional = null,
                mantenimiento = mantenimientosEjemplo,
                item = "ACTICO/035",
                serial = "2WKKT93",
                modelo = "Latitude 3420",
                marca = "Dell",
                categoria = null,
                sede = sede1,
                estado = EstadoDispositivo.DISPONIBLE,
                funcional = true,
                clasificacion = if (EstadoDispositivo.DISPONIBLE == EstadoDispositivo.BAJA) "OBSOLETO" else "ALTA",
                fechaAdquisicion = LocalDate.parse("2022-05-15"),
                costo = 2500000.0,
                codigoActivo = "ACT-PC-001",
                tipo = "Portatil",
                observaciones = "Equipo de oficina",
            ))
        }
        // Celular
        if (dispositivoService.findAll().none { it.serial == "CEL-1001" }) {
            dispositivoService.save(Celular(
                imei1 = "123456789012345",
                imei2 = "987654321098765",
                procesador = "Snapdragon 888",
                ram = "8GB",
                almacenamiento = "128GB",
                tenable = true,
                cuentaGmailActual = "usuario@gmail.com",
                contrasenaGmailActual = "pass1234",
                cuentaGmailAnterior = null,
                contrasenaGmailAnterior = null,
                ofimatica = "Office Mobile",
                sistemaOperativoMovil = "Android 12",
                dispositivoId = 0,
                item = "ACTICO/035",
                serial = "CEL-1001",
                modelo = "Galaxy S21",
                marca = "Samsung",
                categoria = null,
                sede = sede1,
                estado = EstadoDispositivo.DISPONIBLE,
                clasificacion = if (EstadoDispositivo.DISPONIBLE == EstadoDispositivo.BAJA) "OBSOLETO" else "MEDIA",
                fechaAdquisicion = LocalDate.parse("2023-03-20"),
                costo = 1800000.0,
                funcional = false,
                codigoActivo = "ACT-CEL-001",
                tipo = "CELULAR",
                observaciones = "Celular corporativo de ejemplo",
            ))
        }
        // Impresora
        if (dispositivoService.findAll().none { it.serial == "IMP-1001" }) {
            dispositivoService.save(Impresora(
                item = "ACTICO/035",
                ipAsignada = "192.168.1.10",
                contrasenaDispositivo = "admin123",
                tecnologiaImpresion = null,
                serial = "IMP-1001",
                modelo = "HP LaserJet",
                marca = "HP",
                categoria = null,
                sede = sede1,
                estado = EstadoDispositivo.DISPONIBLE,
                clasificacion = if (EstadoDispositivo.DISPONIBLE == EstadoDispositivo.BAJA) "OBSOLETO" else "BAJA",
                fechaAdquisicion = LocalDate.parse("2021-11-10"),
                costo = 700000.0,
                funcional = false,
                codigoActivo = "ACT-IMP-001",
                tipo = "IMPRESORA",
                observaciones = "Impresora de recepción",
            ))
        }
        // PDA
        if (dispositivoService.findAll().none { it.serial == "PDA-1001" }) {
            dispositivoService.save(Pda(
                item = "ACTICO/035",
                numeroPda = "PDA-5001",
                sistemaOperativoPda = "Android 10",
                emailAsociado = null,
                contrasenaEmail = null,
                serial = "PDA-1001",
                modelo = "Zebra TC21",
                marca = "Zebra",
                categoria = null,
                sede = sede1,
                estado = EstadoDispositivo.DISPONIBLE,
                clasificacion = if (EstadoDispositivo.DISPONIBLE == EstadoDispositivo.BAJA) "OBSOLETO" else "BAJA",
                fechaAdquisicion = LocalDate.parse("2022-08-01"),
                costo = 1200000.0,
                funcional = false,
                codigoActivo = "ACT-PDA-001",
                tipo = "PDA",
                observaciones = "PDA para inventario",
            ))
        }
        // Biometrico
        if (dispositivoService.findAll().none { it.serial == "BIO-1001" }) {
            dispositivoService.save(Biometrico(
                item = "ACTICO/035",
                ipAsignada = "192.168.2.10",
                tipoBiometrico = "Huella",
                serial = "BIO-1001",
                modelo = "ZKTeco F18",
                marca = "ZKTeco",
                categoria = null,
                sede = sede1,
                estado = EstadoDispositivo.DISPONIBLE,
                clasificacion = if (EstadoDispositivo.DISPONIBLE == EstadoDispositivo.BAJA) "OBSOLETO" else "BAJA",
                fechaAdquisicion = LocalDate.parse("2022-09-15"),
                costo = 900000.0,
                funcional = false,
                codigoActivo = "ACT-BIO-001",
                tipo = "BIOMETRICO",
                observaciones = "Control de acceso",
            ))
        }
        // Camara
        if (dispositivoService.findAll().none { it.serial == "CAM-1001" }) {
            dispositivoService.save(Camara(
                item = "ACTICO/035",
                macAddress = "00:1A:2B:3C:4D:5E",
                ipAsignada = "192.168.3.10",
                tipoCamara = null,
                serial = "CAM-1001",
                modelo = "Hikvision DS-2CD",
                marca = "Hikvision",
                categoria = null,
                sede = sede1,
                estado = EstadoDispositivo.DISPONIBLE,
                clasificacion = if (EstadoDispositivo.DISPONIBLE == EstadoDispositivo.BAJA) "OBSOLETO" else "BAJA",
                fechaAdquisicion = LocalDate.parse("2023-02-10"),
                costo = 600000.0,
                funcional = false,
                codigoActivo = "ACT-CAM-001",
                tipo = "CAMARA",
                observaciones = "Cámara de seguridad",
            ))
        }
        // Intercomunicador
        if (dispositivoService.findAll().none { it.serial == "INT-1001" }) {
            dispositivoService.save(Intercomunicador(
                item = "ACTICO/035",
                numeroSerieCompleto = "IC-8001-2023",
                accesoriosIncluidos = "Micrófono, Altavoz",
                fechaInstalacion = null,
                fechaRetiro = null,
                serial = "INT-1001",
                modelo = "Aiphone IXG",
                marca = "Aiphone",
                categoria = null,
                sede = sede1,
                estado = EstadoDispositivo.DISPONIBLE,
                clasificacion = if (EstadoDispositivo.DISPONIBLE == EstadoDispositivo.BAJA) "OBSOLETO" else "BAJA",
                fechaAdquisicion = LocalDate.parse("2023-04-05"),
                costo = 1500000.0,
                funcional = false,
                codigoActivo = "ACT-INT-001",
                tipo = "INTERCOMUNICADOR",
                observaciones = "Intercomunicador principal",
            ))
        }
        // Accesorios
        // Crear accesorio normal
        val accesorioNormal = accesorioService.save(
            Accesorio(
                tipo = "Mouse",
                marca = "Logitech",
                serial = "MOUSE-001",
                modelo = "M185",
                estado = "Bueno",
                esCombo = false,
                accesoriosCombo = emptyList()
            )
        )
        // Crear accesorio combo (que incluye el accesorio normal)
        val accesorioCombo = accesorioService.save(
            Accesorio(
                tipo = "Combo Oficina",
                marca = null,
                serial = "COMBO-001",
                modelo = null,
                estado = "Bueno",
                esCombo = true,
                accesoriosCombo = listOf(accesorioNormal)
            )
        )
        // Crear una asignación de ejemplo para el empleado y dispositivo creados
        val dispositivoEjemplo = dispositivoService.findAll().firstOrNull() // Usar el primer dispositivo creado
        if (dispositivoEjemplo != null) {
            val asignacion = asignacionService.create(
                com.inventory.Demo.modulos.Asignacion.dto.AsignacionRequest(
                    dispositivoId = dispositivoEjemplo.dispositivoId,
                    empleadoId = empleado1.id!!,
                    sedeId = sede1.id!!, // <--- ahora se envía la sede
                    areaId = area1.id!!, // <--- nuevo campo obligatorio para el área
                    fechaAsignacion = LocalDate.now(),
                    comentario = "Asignación de ejemplo con accesorios",
                    observaciones = "Asignación generada por el seed",
                    accesorios = listOf(accesorioNormal.id!!, accesorioCombo.id!!)
                )
            )
            // Actualizar los accesorios para que tengan la asignación creada
        }
    }
} 