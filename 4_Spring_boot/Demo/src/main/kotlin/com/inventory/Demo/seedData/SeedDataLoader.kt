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

@Component
class SeedDataLoader(
    private val dispositivoService: DispositivoService,
    private val areaService: AreaService,
    private val empleadoService: EmpleadoService
) : CommandLineRunner {
    override fun run(vararg args: String?) {
        if (areaService.findAll().isNotEmpty() || empleadoService.findAll().isNotEmpty()) {
            // Ya hay datos, no volver a sembrar
            return
        }
        // Áreas
        val area1 = areaService.save(Area(
            nombre = "Sistemas", subarea = "Infraestructura", tipoArea = "Tecnología"
        ))
        val area2 = areaService.save(Area(
            nombre = "Recursos Humanos", subarea = "Selección", tipoArea = "Administrativa"
        ))
        val area3 = areaService.save(Area(
            nombre = "Finanzas", subarea = "Contabilidad", tipoArea = "Administrativa"
        ))
        val area4 = areaService.save(Area(
            nombre = "Logística", subarea = "Almacén", tipoArea = "Operativa"
        ))
        val area5 = areaService.save(Area(
            nombre = "Comercial", subarea = "Ventas", tipoArea = "Operativa"
        ))
        // Empleados
        empleadoService.save(Empleado(
            documentoIdentidad = "10000001",
            nombreCompleto = "Ana Torres",
            cargo = "Analista de Sistemas",
            email = "ana.torres@empresa.com",
            telefono = "3001111111",
            area = area1
        ))
        empleadoService.save(Empleado(
            documentoIdentidad = "10000002",
            nombreCompleto = "Carlos Ruiz",
            cargo = "Jefe de Infraestructura",
            email = "carlos.ruiz@empresa.com",
            telefono = "3002222222",
            area = area1
        ))
        empleadoService.save(Empleado(
            documentoIdentidad = "10000003",
            nombreCompleto = "Laura Gómez",
            cargo = "Coordinadora de Selección",
            email = "laura.gomez@empresa.com",
            telefono = "3003333333",
            area = area2
        ))
        empleadoService.save(Empleado(
            documentoIdentidad = "10000004",
            nombreCompleto = "Pedro Martínez",
            cargo = "Contador",
            email = "pedro.martinez@empresa.com",
            telefono = "3004444444",
            area = area3
        ))
        empleadoService.save(Empleado(
            documentoIdentidad = "10000005",
            nombreCompleto = "Sofía López",
            cargo = "Jefe de Almacén",
            email = "sofia.lopez@empresa.com",
            telefono = "3005555555",
            area = area4
        ))
        empleadoService.save(Empleado(
            documentoIdentidad = "10000006",
            nombreCompleto = "Miguel Castro",
            cargo = "Ejecutivo de Ventas",
            email = "miguel.castro@empresa.com",
            telefono = "3006666666",
            area = area5
        ))
        // Videobeams
        dispositivoService.save(Videobeam(
            serial = "VB-1001",
            modelo = "Epson X41",
            marca = "Epson",
            estado = EstadoDispositivo.DISPONIBLE,
            fechaAdquisicion = LocalDate.parse("2023-01-10"),
            costo = 1200000.0,
            codigoActivo = "ACT-VB-001",
            tipo = "VIDEOBEAM",
            observaciones = "Videobeam para sala A",
            tipoConexion = "HDMI/VGA",
            resolucionNativa = "1920x1080"
        ))
        dispositivoService.save(Videobeam(
            serial = "VB-1002",
            modelo = "BenQ MS550",
            marca = "BenQ",
            estado = EstadoDispositivo.DISPONIBLE,
            fechaAdquisicion = LocalDate.parse("2022-11-15"),
            costo = 1100000.0,
            codigoActivo = "ACT-VB-002",
            tipo = "VIDEOBEAM",
            observaciones = "Videobeam portátil",
            tipoConexion = "HDMI",
            resolucionNativa = "1280x800"
        ))
        dispositivoService.save(Videobeam(
            serial = "VB-1003",
            modelo = "Optoma S334e",
            marca = "Optoma",
            estado = EstadoDispositivo.MANTENIMIENTO,
            fechaAdquisicion = LocalDate.parse("2021-09-20"),
            costo = 1300000.0,
            codigoActivo = "ACT-VB-003",
            tipo = "VIDEOBEAM",
            observaciones = "Requiere cambio de lámpara",
            tipoConexion = "VGA",
            resolucionNativa = "800x600"
        ))
        dispositivoService.save(Videobeam(
            serial = "VB-1004",
            modelo = "ViewSonic PA503S",
            marca = "ViewSonic",
            estado = EstadoDispositivo.ASIGNADO,
            fechaAdquisicion = LocalDate.parse("2024-02-05"),
            costo = 1400000.0,
            codigoActivo = "ACT-VB-004",
            tipo = "VIDEOBEAM",
            observaciones = "Asignado a sala de capacitación",
            tipoConexion = "HDMI/VGA",
            resolucionNativa = "800x600"
        ))
        dispositivoService.save(Videobeam(
            serial = "VB-1005",
            modelo = "LG PH550",
            marca = "LG",
            estado = EstadoDispositivo.DISPONIBLE,
            fechaAdquisicion = LocalDate.parse("2023-06-18"),
            costo = 1600000.0,
            codigoActivo = "ACT-VB-005",
            tipo = "VIDEOBEAM",
            observaciones = "Videobeam inalámbrico",
            tipoConexion = "HDMI/WiFi",
            resolucionNativa = "1280x720"
        ))
        // Computadores
        dispositivoService.save(Computador(
            procesador = "Intel i5",
            ram = "8GB",
            almacenamiento = "256GB SSD",
            sistemaOperativo = "Windows 10",
            softwareAdicional = "Office 2019",
            serial = "PC-2001",
            modelo = "ThinkPad L14",
            marca = "Lenovo",
            estado = EstadoDispositivo.DISPONIBLE,
            fechaAdquisicion = LocalDate.parse("2023-03-12"),
            costo = 3500000.0,
            codigoActivo = "ACT-PC-001",
            tipo = "COMPUTADOR",
            observaciones = "Laptop para oficina"
        ))
        dispositivoService.save(Computador(
            procesador = "Intel i7",
            ram = "16GB",
            almacenamiento = "512GB SSD",
            sistemaOperativo = "Windows 11",
            softwareAdicional = "Office 2021",
            serial = "PC-2002",
            modelo = "EliteBook 840",
            marca = "HP",
            estado = EstadoDispositivo.ASIGNADO,
            fechaAdquisicion = LocalDate.parse("2022-08-22"),
            costo = 4000000.0,
            codigoActivo = "ACT-PC-002",
            tipo = "COMPUTADOR",
            observaciones = "Asignado a gerente"
        ))
        dispositivoService.save(Computador(
            procesador = "AMD Ryzen 5",
            ram = "8GB",
            almacenamiento = "1TB HDD",
            sistemaOperativo = "Ubuntu 22.04",
            softwareAdicional = null,
            serial = "PC-2003",
            modelo = "Aspire 5",
            marca = "Acer",
            estado = EstadoDispositivo.MANTENIMIENTO,
            fechaAdquisicion = LocalDate.parse("2021-12-01"),
            costo = 2800000.0,
            codigoActivo = "ACT-PC-003",
            tipo = "COMPUTADOR",
            observaciones = "Revisión de hardware"
        ))
        dispositivoService.save(Computador(
            procesador = "Apple M1",
            ram = "8GB",
            almacenamiento = "256GB SSD",
            sistemaOperativo = "macOS Monterey",
            softwareAdicional = null,
            serial = "PC-2004",
            modelo = "MacBook Air",
            marca = "Apple",
            estado = EstadoDispositivo.DISPONIBLE,
            fechaAdquisicion = LocalDate.parse("2024-01-10"),
            costo = 6000000.0,
            codigoActivo = "ACT-PC-004",
            tipo = "COMPUTADOR",
            observaciones = "Nuevo ingreso"
        ))
        dispositivoService.save(Computador(
            procesador = "Intel i3",
            ram = "4GB",
            almacenamiento = "500GB HDD",
            sistemaOperativo = "Windows 10",
            softwareAdicional = null,
            serial = "PC-2005",
            modelo = "Latitude 3420",
            marca = "Dell",
            estado = EstadoDispositivo.BAJA,
            fechaAdquisicion = LocalDate.parse("2020-05-15"),
            costo = 2500000.0,
            codigoActivo = "ACT-PC-005",
            tipo = "COMPUTADOR",
            observaciones = "Equipo dado de baja"
        ))
        // Celulares
        dispositivoService.save(Celular(
            imei1 = "123456789012345",
            imei2 = null,
            sistemaOperativoMovil = "Android 12",
            emailAsociado = null,
            contrasenaEmail = null,
            capacidadSim = "Dual SIM",
            serial = "CEL-3001",
            modelo = "Galaxy S21",
            marca = "Samsung",
            estado = EstadoDispositivo.DISPONIBLE,
            fechaAdquisicion = LocalDate.parse("2023-04-20"),
            costo = 2500000.0,
            codigoActivo = "ACT-CEL-001",
            tipo = "CELULAR",
            observaciones = "Celular para ventas"
        ))
        dispositivoService.save(Celular(
            imei1 = "234567890123456",
            imei2 = null,
            sistemaOperativoMovil = "iOS 15",
            emailAsociado = null,
            contrasenaEmail = null,
            capacidadSim = "Single SIM",
            serial = "CEL-3002",
            modelo = "iPhone 13",
            marca = "Apple",
            estado = EstadoDispositivo.ASIGNADO,
            fechaAdquisicion = LocalDate.parse("2022-10-10"),
            costo = 4000000.0,
            codigoActivo = "ACT-CEL-002",
            tipo = "CELULAR",
            observaciones = "Asignado a dirección"
        ))
        dispositivoService.save(Celular(
            imei1 = "345678901234567",
            imei2 = null,
            sistemaOperativoMovil = "Android 11",
            emailAsociado = null,
            contrasenaEmail = null,
            capacidadSim = "Dual SIM",
            serial = "CEL-3003",
            modelo = "Redmi Note 10",
            marca = "Xiaomi",
            estado = EstadoDispositivo.MANTENIMIENTO,
            fechaAdquisicion = LocalDate.parse("2021-07-15"),
            costo = 1200000.0,
            codigoActivo = "ACT-CEL-003",
            tipo = "CELULAR",
            observaciones = "Pantalla rota"
        ))
        dispositivoService.save(Celular(
            imei1 = "456789012345678",
            imei2 = null,
            sistemaOperativoMovil = "Android 12",
            emailAsociado = null,
            contrasenaEmail = null,
            capacidadSim = "Single SIM",
            serial = "CEL-3004",
            modelo = "Moto G60",
            marca = "Motorola",
            estado = EstadoDispositivo.DISPONIBLE,
            fechaAdquisicion = LocalDate.parse("2024-02-01"),
            costo = 1100000.0,
            codigoActivo = "ACT-CEL-004",
            tipo = "CELULAR",
            observaciones = "Celular de repuesto"
        ))
        dispositivoService.save(Celular(
            imei1 = "567890123456789",
            imei2 = null,
            sistemaOperativoMovil = "Android 10",
            emailAsociado = null,
            contrasenaEmail = null,
            capacidadSim = "Dual SIM",
            serial = "CEL-3005",
            modelo = "P40 Lite",
            marca = "Huawei",
            estado = EstadoDispositivo.BAJA,
            fechaAdquisicion = LocalDate.parse("2020-09-30"),
            costo = 900000.0,
            codigoActivo = "ACT-CEL-005",
            tipo = "CELULAR",
            observaciones = "Equipo dado de baja"
        ))
        // Impresoras
        dispositivoService.save(Impresora(
            ipAsignada = "192.168.1.10",
            contrasenaDispositivo = "admin123",
            tecnologiaImpresion = "Laser",
            serial = "IMP-4001",
            modelo = "LaserJet Pro M404",
            marca = "HP",
            estado = EstadoDispositivo.DISPONIBLE,
            fechaAdquisicion = LocalDate.parse("2023-05-10"),
            costo = 800000.0,
            codigoActivo = "ACT-IMP-001",
            tipo = "IMPRESORA",
            observaciones = "Impresora para oficina"
        ))
        dispositivoService.save(Impresora(
            ipAsignada = "192.168.1.11",
            contrasenaDispositivo = "epson2023",
            tecnologiaImpresion = "Tinta continua",
            serial = "IMP-4002",
            modelo = "EcoTank L3150",
            marca = "Epson",
            estado = EstadoDispositivo.ASIGNADO,
            fechaAdquisicion = LocalDate.parse("2022-12-01"),
            costo = 700000.0,
            codigoActivo = "ACT-IMP-002",
            tipo = "IMPRESORA",
            observaciones = "Asignada a recepción"
        ))
        dispositivoService.save(Impresora(
            ipAsignada = "192.168.1.12",
            contrasenaDispositivo = "canon2021",
            tecnologiaImpresion = "Tinta continua",
            serial = "IMP-4003",
            modelo = "PIXMA G3110",
            marca = "Canon",
            estado = EstadoDispositivo.MANTENIMIENTO,
            fechaAdquisicion = LocalDate.parse("2021-08-20"),
            costo = 600000.0,
            codigoActivo = "ACT-IMP-003",
            tipo = "IMPRESORA",
            observaciones = "En reparación"
        ))
        dispositivoService.save(Impresora(
            ipAsignada = "192.168.1.13",
            contrasenaDispositivo = "lexmark2024",
            tecnologiaImpresion = "Laser",
            serial = "IMP-4004",
            modelo = "B2338dw",
            marca = "Lexmark",
            estado = EstadoDispositivo.DISPONIBLE,
            fechaAdquisicion = LocalDate.parse("2024-03-15"),
            costo = 900000.0,
            codigoActivo = "ACT-IMP-004",
            tipo = "IMPRESORA",
            observaciones = "Nueva adquisición"
        ))
        dispositivoService.save(Impresora(
            ipAsignada = "192.168.1.14",
            contrasenaDispositivo = "brother2020",
            tecnologiaImpresion = "Laser",
            serial = "IMP-4005",
            modelo = "HL-L2370DW",
            marca = "Brother",
            estado = EstadoDispositivo.BAJA,
            fechaAdquisicion = LocalDate.parse("2020-11-05"),
            costo = 500000.0,
            codigoActivo = "ACT-IMP-005",
            tipo = "IMPRESORA",
            observaciones = "Equipo dado de baja"
        ))
        // PDAs
        dispositivoService.save(Pda(
            numeroPda = "PDA-5001",
            sistemaOperativoPda = "Android 10",
            emailAsociado = null,
            contrasenaEmail = null,
            serial = "PDA-5001",
            modelo = "TC21",
            marca = "Zebra",
            estado = EstadoDispositivo.DISPONIBLE,
            fechaAdquisicion = LocalDate.parse("2023-06-10"),
            costo = 2000000.0,
            codigoActivo = "ACT-PDA-001",
            tipo = "PDA",
            observaciones = "PDA para inventario"
        ))
        dispositivoService.save(Pda(
            numeroPda = "PDA-5002",
            sistemaOperativoPda = "Android 9",
            emailAsociado = null,
            contrasenaEmail = null,
            serial = "PDA-5002",
            modelo = "EDA51",
            marca = "Honeywell",
            estado = EstadoDispositivo.ASIGNADO,
            fechaAdquisicion = LocalDate.parse("2022-09-01"),
            costo = 1800000.0,
            codigoActivo = "ACT-PDA-002",
            tipo = "PDA",
            observaciones = "Asignado a logística"
        ))
        dispositivoService.save(Pda(
            numeroPda = "PDA-5003",
            sistemaOperativoPda = "Android 8",
            emailAsociado = null,
            contrasenaEmail = null,
            serial = "PDA-5003",
            modelo = "Memor 10",
            marca = "Datalogic",
            estado = EstadoDispositivo.MANTENIMIENTO,
            fechaAdquisicion = LocalDate.parse("2021-10-15"),
            costo = 1700000.0,
            codigoActivo = "ACT-PDA-003",
            tipo = "PDA",
            observaciones = "En reparación"
        ))
        dispositivoService.save(Pda(
            numeroPda = "PDA-5004",
            sistemaOperativoPda = "Android 11",
            emailAsociado = null,
            contrasenaEmail = null,
            serial = "PDA-5004",
            modelo = "Nautiz X2",
            marca = "Handheld",
            estado = EstadoDispositivo.DISPONIBLE,
            fechaAdquisicion = LocalDate.parse("2024-01-20"),
            costo = 2100000.0,
            codigoActivo = "ACT-PDA-004",
            tipo = "PDA",
            observaciones = "Nuevo ingreso"
        ))
        dispositivoService.save(Pda(
            numeroPda = "PDA-5005",
            sistemaOperativoPda = "Android 7",
            emailAsociado = null,
            contrasenaEmail = null,
            serial = "PDA-5005",
            modelo = "Falcon X4",
            marca = "Datalogic",
            estado = EstadoDispositivo.BAJA,
            fechaAdquisicion = LocalDate.parse("2020-07-30"),
            costo = 1600000.0,
            codigoActivo = "ACT-PDA-005",
            tipo = "PDA",
            observaciones = "Equipo dado de baja"
        ))
        // Biometricos
        dispositivoService.save(Biometrico(
            ipAsignada = "192.168.2.10",
            tipoBiometrico = "Huella",
            serial = "BIO-6001",
            modelo = "ZKTeco K40",
            marca = "ZKTeco",
            estado = EstadoDispositivo.DISPONIBLE,
            fechaAdquisicion = LocalDate.parse("2023-08-10"),
            costo = 900000.0,
            codigoActivo = "ACT-BIO-001",
            tipo = "BIOMETRICO",
            observaciones = "Biométrico para acceso principal"
        ))
        dispositivoService.save(Biometrico(
            ipAsignada = "192.168.2.11",
            tipoBiometrico = "Facial",
            serial = "BIO-6002",
            modelo = "ZKTeco MB160",
            marca = "ZKTeco",
            estado = EstadoDispositivo.ASIGNADO,
            fechaAdquisicion = LocalDate.parse("2022-07-15"),
            costo = 1200000.0,
            codigoActivo = "ACT-BIO-002",
            tipo = "BIOMETRICO",
            observaciones = "Asignado a oficina de RRHH"
        ))
        dispositivoService.save(Biometrico(
            ipAsignada = "192.168.2.12",
            tipoBiometrico = "Huella",
            serial = "BIO-6003",
            modelo = "Suprema BioLite",
            marca = "Suprema",
            estado = EstadoDispositivo.MANTENIMIENTO,
            fechaAdquisicion = LocalDate.parse("2021-05-20"),
            costo = 1500000.0,
            codigoActivo = "ACT-BIO-003",
            tipo = "BIOMETRICO",
            observaciones = "En reparación"
        ))
        dispositivoService.save(Biometrico(
            ipAsignada = "192.168.2.13",
            tipoBiometrico = "Facial",
            serial = "BIO-6004",
            modelo = "Anviz FaceDeep 3",
            marca = "Anviz",
            estado = EstadoDispositivo.DISPONIBLE,
            fechaAdquisicion = LocalDate.parse("2024-03-01"),
            costo = 1300000.0,
            codigoActivo = "ACT-BIO-004",
            tipo = "BIOMETRICO",
            observaciones = "Nuevo ingreso"
        ))
        dispositivoService.save(Biometrico(
            ipAsignada = "192.168.2.14",
            tipoBiometrico = "Huella",
            serial = "BIO-6005",
            modelo = "ZKTeco F18",
            marca = "ZKTeco",
            estado = EstadoDispositivo.BAJA,
            fechaAdquisicion = LocalDate.parse("2020-10-10"),
            costo = 800000.0,
            codigoActivo = "ACT-BIO-005",
            tipo = "BIOMETRICO",
            observaciones = "Equipo dado de baja"
        ))
        // Camaras
        dispositivoService.save(Camara(
            macAddress = "00:1A:2B:3C:4D:5E",
            ipAsignada = "192.168.3.10",
            tipoCamara = "IP",
            serial = "CAM-7001",
            modelo = "Hikvision DS-2CD",
            marca = "Hikvision",
            estado = EstadoDispositivo.DISPONIBLE,
            fechaAdquisicion = LocalDate.parse("2023-09-10"),
            costo = 600000.0,
            codigoActivo = "ACT-CAM-001",
            tipo = "CAMARA",
            observaciones = "Cámara para vigilancia"
        ))
        dispositivoService.save(Camara(
            macAddress = "00:1A:2B:3C:4D:5F",
            ipAsignada = "192.168.3.11",
            tipoCamara = "Analógica",
            serial = "CAM-7002",
            modelo = "Dahua HAC-HFW",
            marca = "Dahua",
            estado = EstadoDispositivo.ASIGNADO,
            fechaAdquisicion = LocalDate.parse("2022-06-15"),
            costo = 500000.0,
            codigoActivo = "ACT-CAM-002",
            tipo = "CAMARA",
            observaciones = "Asignada a bodega"
        ))
        dispositivoService.save(Camara(
            macAddress = "00:1A:2B:3C:4D:60",
            ipAsignada = "192.168.3.12",
            tipoCamara = "IP",
            serial = "CAM-7003",
            modelo = "EZVIZ C6N",
            marca = "EZVIZ",
            estado = EstadoDispositivo.MANTENIMIENTO,
            fechaAdquisicion = LocalDate.parse("2021-04-20"),
            costo = 400000.0,
            codigoActivo = "ACT-CAM-003",
            tipo = "CAMARA",
            observaciones = "En reparación"
        ))
        dispositivoService.save(Camara(
            macAddress = "00:1A:2B:3C:4D:61",
            ipAsignada = "192.168.3.13",
            tipoCamara = "IP",
            serial = "CAM-7004",
            modelo = "TP-Link Tapo",
            marca = "TP-Link",
            estado = EstadoDispositivo.DISPONIBLE,
            fechaAdquisicion = LocalDate.parse("2024-02-10"),
            costo = 700000.0,
            codigoActivo = "ACT-CAM-004",
            tipo = "CAMARA",
            observaciones = "Nueva adquisición"
        ))
        dispositivoService.save(Camara(
            macAddress = "00:1A:2B:3C:4D:62",
            ipAsignada = "192.168.3.14",
            tipoCamara = "Analógica",
            serial = "CAM-7005",
            modelo = "Hikvision TurboHD",
            marca = "Hikvision",
            estado = EstadoDispositivo.BAJA,
            fechaAdquisicion = LocalDate.parse("2020-08-05"),
            costo = 300000.0,
            codigoActivo = "ACT-CAM-005",
            tipo = "CAMARA",
            observaciones = "Equipo dado de baja"
        ))
        // Intercomunicadores
        dispositivoService.save(Intercomunicador(
            numeroSerieCompleto = "IC-8001-2023",
            accesoriosIncluidos = "Micrófono, Altavoz",
            fechaInstalacion = LocalDate.parse("2023-10-01"),
            fechaRetiro = null,
            serial = "IC-8001",
            modelo = "AIPHONE IXG",
            marca = "AIPHONE",
            estado = EstadoDispositivo.DISPONIBLE,
            fechaAdquisicion = LocalDate.parse("2023-10-01"),
            costo = 2000000.0,
            codigoActivo = "ACT-IC-001",
            tipo = "INTERCOMUNICADOR",
            observaciones = "Intercomunicador para portería"
        ))
        dispositivoService.save(Intercomunicador(
            numeroSerieCompleto = "IC-8002-2022",
            accesoriosIncluidos = "Micrófono, Altavoz, Cámara",
            fechaInstalacion = LocalDate.parse("2022-05-15"),
            fechaRetiro = null,
            serial = "IC-8002",
            modelo = "Fermax VEO",
            marca = "Fermax",
            estado = EstadoDispositivo.ASIGNADO,
            fechaAdquisicion = LocalDate.parse("2022-05-15"),
            costo = 1800000.0,
            codigoActivo = "ACT-IC-002",
            tipo = "INTERCOMUNICADOR",
            observaciones = "Asignado a oficina principal"
        ))
        dispositivoService.save(Intercomunicador(
            numeroSerieCompleto = "IC-8003-2021",
            accesoriosIncluidos = "Micrófono",
            fechaInstalacion = LocalDate.parse("2021-03-10"),
            fechaRetiro = LocalDate.parse("2022-03-10"),
            serial = "IC-8003",
            modelo = "Golmar G2+",
            marca = "Golmar",
            estado = EstadoDispositivo.MANTENIMIENTO,
            fechaAdquisicion = LocalDate.parse("2021-03-10"),
            costo = 1500000.0,
            codigoActivo = "ACT-IC-003",
            tipo = "INTERCOMUNICADOR",
            observaciones = "En reparación"
        ))
        dispositivoService.save(Intercomunicador(
            numeroSerieCompleto = "IC-8004-2024",
            accesoriosIncluidos = "Altavoz",
            fechaInstalacion = LocalDate.parse("2024-01-20"),
            fechaRetiro = null,
            serial = "IC-8004",
            modelo = "Tegui Classe 300",
            marca = "Tegui",
            estado = EstadoDispositivo.DISPONIBLE,
            fechaAdquisicion = LocalDate.parse("2024-01-20"),
            costo = 2200000.0,
            codigoActivo = "ACT-IC-004",
            tipo = "INTERCOMUNICADOR",
            observaciones = "Nuevo ingreso"
        ))
        dispositivoService.save(Intercomunicador(
            numeroSerieCompleto = "IC-8005-2020",
            accesoriosIncluidos = "Micrófono, Altavoz",
            fechaInstalacion = LocalDate.parse("2020-06-05"),
            fechaRetiro = LocalDate.parse("2022-06-05"),
            serial = "IC-8005",
            modelo = "Fermax Smile",
            marca = "Fermax",
            estado = EstadoDispositivo.BAJA,
            fechaAdquisicion = LocalDate.parse("2020-06-05"),
            costo = 1300000.0,
            codigoActivo = "ACT-IC-005",
            tipo = "INTERCOMUNICADOR",
            observaciones = "Equipo dado de baja"
        ))
    }
} 