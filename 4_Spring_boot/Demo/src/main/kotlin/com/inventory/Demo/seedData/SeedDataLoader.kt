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
import com.inventory.Demo.modulos.Accesorio.dto.AccesorioRequest
import com.inventory.Demo.modulos.Accesorio.dto.AccesorioResponseDTO
import com.inventory.Demo.modulos.Categoria.model.Categoria
import com.inventory.Demo.modulos.Categoria.repository.CategoriaRepository
import com.inventory.Demo.modulos.Asignacion.service.AsignacionService
import com.inventory.Demo.modulos.Asignacion.dto.AsignacionRequest
import com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.MantenimientoEntry

@Component
class SeedDataLoader(
    private val dispositivoService: DispositivoService,
    private val areaService: AreaService,
    private val empleadoService: EmpleadoService,
    private val sedeService: SedeService,
    private val accesorioService: AccesorioService,
    private val asignacionService: AsignacionService,
    private val categoriaRepository: CategoriaRepository
) : CommandLineRunner {
    override fun run(vararg args: String?) {
        if (areaService.findAll().isNotEmpty() || empleadoService.findAll().isNotEmpty()) {
            // Ya hay datos, no volver a sembrar
            return
        }
        
        // Crear categoría para accesorios si no existe
        val categoriaAccesorios = categoriaRepository.findByNombre("Accesorios") 
            ?: categoriaRepository.save(Categoria(nombre = "Accesorios", descripcion = "Categoría para accesorios de dispositivos"))
        
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
        if (dispositivoService.findAll().none { it.serial == "COMP-1001" }) {
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
                mac = "00:1A:2B:3C:4D:5E",
                ip = "192.168.1.10",
                ofimatica = "Office 2019",
                antivirus = "Ninguno",
                tenable = true,
                sistemaOperativo = "Windows 10 Pro",
                softwareAdicional = null,
                mantenimiento = mantenimientosEjemplo,
                item = "ACTICO/035",
                serial = "COMP-1001",
                modelo = "Latitude 3420",
                marca = "DELL",
                categoria = null,
                sede = sede1,
                estado = EstadoDispositivo.DISPONIBLE,
                clasificacion = if (EstadoDispositivo.DISPONIBLE == EstadoDispositivo.BAJA) "OBSOLETO" else "BAJA",
                fechaAdquisicion = LocalDate.parse("2023-01-10"),
                costo = 1200000.0,
                funcional = true,
                codigoActivo = "ACT-COMP-001",
                tipo = "COMPUTADOR",
                observaciones = "Computador para auditoría"
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
                item = "ACTICO/035",
                serial = "CEL-1001",
                modelo = "iPhone 13",
                marca = "Apple",
                categoria = null,
                sede = sede1,
                estado = EstadoDispositivo.DISPONIBLE,
                clasificacion = if (EstadoDispositivo.DISPONIBLE == EstadoDispositivo.BAJA) "OBSOLETO" else "BAJA",
                fechaAdquisicion = LocalDate.parse("2023-03-15"),
                costo = 2500000.0,
                funcional = true,
                codigoActivo = "ACT-CEL-001",
                tipo = "CELULAR",
                observaciones = "Celular corporativo"
            ))
        }
        // PDA
        if (dispositivoService.findAll().none { it.serial == "PDA-1001" }) {
            dispositivoService.save(Pda(
                numeroPda = "PDA-5001",
                sistemaOperativoPda = "Android 10",
                emailAsociado = null,
                contrasenaEmail = null,
                item = "ACTICO/035",
                serial = "PDA-1001",
                modelo = "Zebra TC21",
                marca = "Zebra",
                categoria = null,
                sede = sede1,
                estado = EstadoDispositivo.DISPONIBLE,
                clasificacion = if (EstadoDispositivo.DISPONIBLE == EstadoDispositivo.BAJA) "OBSOLETO" else "BAJA",
                fechaAdquisicion = LocalDate.parse("2023-05-20"),
                costo = 1800000.0,
                funcional = true,
                codigoActivo = "ACT-PDA-001",
                tipo = "PDA",
                observaciones = "PDA para inventario"
            ))
        }
        // Impresora
        if (dispositivoService.findAll().none { it.serial == "IMP-1001" }) {
            dispositivoService.save(Impresora(
                ipAsignada = "192.168.1.10",
                contrasenaDispositivo = "admin123",
                tecnologiaImpresion = "Láser",
                item = "ACTICO/035",
                serial = "IMP-1001",
                modelo = "HP LaserJet Pro",
                marca = "HP",
                categoria = null,
                sede = sede1,
                estado = EstadoDispositivo.DISPONIBLE,
                clasificacion = if (EstadoDispositivo.DISPONIBLE == EstadoDispositivo.BAJA) "OBSOLETO" else "BAJA",
                fechaAdquisicion = LocalDate.parse("2023-07-10"),
                costo = 800000.0,
                funcional = true,
                codigoActivo = "ACT-IMP-001",
                tipo = "IMPRESORA",
                observaciones = "Impresora de oficina"
            ))
        }
        // Biometrico
        if (dispositivoService.findAll().none { it.serial == "BIO-1001" }) {
            dispositivoService.save(Biometrico(
                ipAsignada = "192.168.2.10",
                tipoBiometrico = "Huella dactilar",
                item = "ACTICO/035",
                serial = "BIO-1001",
                modelo = "Suprema BioMini",
                marca = "Suprema",
                categoria = null,
                sede = sede1,
                estado = EstadoDispositivo.DISPONIBLE,
                clasificacion = if (EstadoDispositivo.DISPONIBLE == EstadoDispositivo.BAJA) "OBSOLETO" else "BAJA",
                fechaAdquisicion = LocalDate.parse("2022-09-15"),
                costo = 900000.0,
                funcional = false,
                codigoActivo = "ACT-BIO-001",
                tipo = "BIOMETRICO",
                observaciones = "Control de acceso"
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
                observaciones = "Cámara de seguridad"
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
                observaciones = "Intercomunicador principal"
            ))
        }
        
        // Accesorios usando la nueva estructura
        // Crear accesorio simple (Mouse)
        var accesorioMouse: AccesorioResponseDTO? = null
        if (accesorioService.findAll().none { it.serial == "MOUSE-001" }) {
            accesorioMouse = accesorioService.create(AccesorioRequest(
                item = "Mouse Logitech M185",
                serial = "MOUSE-001",
                modelo = "M185",
                marca = "Logitech",
                categoriaId = categoriaAccesorios.categoriaId,
                sedeId = sede1.id,
                estado = EstadoDispositivo.DISPONIBLE,
                clasificacion = "Accesorio",
                fechaAdquisicion = LocalDate.parse("2024-01-15"),
                costo = 45000.0,
                funcional = true,
                codigoActivo = "ACC-MOUSE-001",
                tipo = "Mouse",
                observaciones = "Mouse inalámbrico para oficina",
                tipoAccesorio = "Mouse",
                esCombo = false,
                accesoriosComboIds = emptyList()
            ))
        } else {
            accesorioMouse = accesorioService.findAll().find { it.serial == "MOUSE-001" }
        }
        
        // Crear accesorio simple (Teclado)
        var accesorioTeclado: AccesorioResponseDTO? = null
        if (accesorioService.findAll().none { it.serial == "TECLADO-001" }) {
            accesorioTeclado = accesorioService.create(AccesorioRequest(
                item = "Teclado Logitech K380",
                serial = "TECLADO-001",
                modelo = "K380",
                marca = "Logitech",
                categoriaId = categoriaAccesorios.categoriaId,
                sedeId = sede1.id,
                estado = EstadoDispositivo.DISPONIBLE,
                clasificacion = "Accesorio",
                fechaAdquisicion = LocalDate.parse("2024-01-15"),
                costo = 120000.0,
                funcional = true,
                codigoActivo = "ACC-TECLADO-001",
                tipo = "Teclado",
                observaciones = "Teclado inalámbrico para oficina",
                tipoAccesorio = "Teclado",
                esCombo = false,
                accesoriosComboIds = emptyList()
            ))
        } else {
            accesorioTeclado = accesorioService.findAll().find { it.serial == "TECLADO-001" }
        }
        
        // Crear accesorio simple (Cargador)
        var accesorioCargador: AccesorioResponseDTO? = null
        if (accesorioService.findAll().none { it.serial == "CARGADOR-001" }) {
            accesorioCargador = accesorioService.create(AccesorioRequest(
                item = "Cargador Laptop HP",
                serial = "CARGADOR-001",
                modelo = "HP-65W",
                marca = "HP",
                categoriaId = categoriaAccesorios.categoriaId,
                sedeId = sede1.id,
                estado = EstadoDispositivo.DISPONIBLE,
                clasificacion = "Accesorio",
                fechaAdquisicion = LocalDate.parse("2024-01-15"),
                costo = 85000.0,
                funcional = true,
                codigoActivo = "ACC-CARGADOR-001",
                tipo = "Cargador",
                observaciones = "Cargador original HP",
                tipoAccesorio = "Cargador",
                esCombo = false,
                accesoriosComboIds = emptyList()
            ))
        } else {
            accesorioCargador = accesorioService.findAll().find { it.serial == "CARGADOR-001" }
        }
        
        // Crear combo de accesorios (Kit Oficina)
        var accesorioCombo: AccesorioResponseDTO? = null
        if (accesorioService.findAll().none { it.serial == "KIT-OFICINA-001" }) {
            accesorioCombo = accesorioService.create(AccesorioRequest(
                item = "Kit Oficina Completo",
                serial = "KIT-OFICINA-001",
                modelo = "Kit-Office-2024",
                marca = "Varios",
                categoriaId = categoriaAccesorios.categoriaId,
                sedeId = sede1.id,
                estado = EstadoDispositivo.DISPONIBLE,
                clasificacion = "Accesorio",
                fechaAdquisicion = LocalDate.parse("2024-01-15"),
                costo = 250000.0,
                funcional = true,
                codigoActivo = "ACC-KIT-001",
                tipo = "Kit",
                observaciones = "Kit completo para nueva oficina",
                tipoAccesorio = "Kit",
                esCombo = true,
                accesoriosComboIds = emptyList() // Removido porque ya no existe la relación ManyToMany
            ))
        } else {
            accesorioCombo = accesorioService.findAll().find { it.serial == "KIT-OFICINA-001" }
        }
        
        // Crear una asignación de ejemplo para el empleado y dispositivo creados
        val dispositivoEjemplo = dispositivoService.findAll().firstOrNull() // Usar el primer dispositivo creado
        if (dispositivoEjemplo != null && accesorioMouse != null && accesorioCombo != null) {
            asignacionService.create(
                AsignacionRequest(
                    dispositivoId = dispositivoEjemplo.dispositivoId,
                    empleadoId = empleado1.id!!,
                    sedeId = sede1.id!!,
                    areaId = area1.id!!,
                    fechaAsignacion = LocalDate.now(),
                    comentario = "Asignación de ejemplo con accesorios",
                    observaciones = "Asignación generada por el seed",
                    accesorios = listOf(accesorioMouse.dispositivoId, accesorioCombo.dispositivoId)
                )
            )
        }
    }
} 