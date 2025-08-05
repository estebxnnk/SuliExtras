package com.inventory.Demo.modulos.Dispositivo.service

import com.inventory.Demo.modulos.Dispositivo.model.Dispositivo
import com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Computador
import com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Celular
import com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Pda
import com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Impresora
import com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Videobeam
import com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Biometrico
import com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Camara
import com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Intercomunicador
import com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo
import com.inventory.Demo.modulos.Dispositivo.repository.DispositivoRepository
import com.inventory.Demo.modulos.Asignacion.repository.AsignacionRepository
import com.inventory.Demo.modulos.Asignacion.model.Asignacion
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DispositivoService(
    private val dispositivoRepository: DispositivoRepository,
    private val asignacionRepository: AsignacionRepository
) {
    fun findAll(): List<Dispositivo> = dispositivoRepository.findAll()
    fun findById(id: Long): Dispositivo? = dispositivoRepository.findById(id).orElse(null)
    fun save(dispositivo: Dispositivo): Dispositivo {
        val existente = dispositivoRepository.findBySerial(dispositivo.serial)
        if (existente != null) {
            throw IllegalArgumentException("Ya existe un dispositivo con el serial: ${dispositivo.serial}")
        }
        val saved = dispositivoRepository.save(dispositivo)
        return saved
    }
    fun update(id: Long, dispositivo: Dispositivo): Dispositivo? {
        return if (dispositivoRepository.existsById(id)) {
            val actualizado = when (dispositivo) {
                is Computador -> Computador(
                    item = dispositivo.item,
                    nombreEquipo = dispositivo.nombreEquipo,
                    procesador = dispositivo.procesador,
                    ram = dispositivo.ram,
                    almacenamiento = dispositivo.almacenamiento,
                    almacenamiento2 = dispositivo.almacenamiento2,
                    mac = dispositivo.mac,
                    ip = dispositivo.ip,
                    ofimatica = dispositivo.ofimatica,
                    antivirus = dispositivo.antivirus,
                    tenable = dispositivo.tenable,
                    sistemaOperativo = dispositivo.sistemaOperativo,
                    softwareAdicional = dispositivo.softwareAdicional,
                    mantenimiento = dispositivo.mantenimiento,
                    dispositivoId = id,
                    serial = dispositivo.serial,
                    modelo = dispositivo.modelo,
                    marca = dispositivo.marca,
                    categoria = dispositivo.categoria,
                    sede = dispositivo.sede,
                    estado = dispositivo.estado,
                    clasificacion = if (dispositivo.estado.name == "BAJA") "OBSOLETO" else "ALTA",
                    fechaAdquisicion = dispositivo.fechaAdquisicion,
                    costo = dispositivo.costo,
                    funcional = dispositivo.funcional,
                    codigoActivo = dispositivo.codigoActivo,
                    tipo = dispositivo.tipo,
                    observaciones = dispositivo.observaciones,
                )
                is Celular -> Celular(
                    imei1 = dispositivo.imei1,
                    imei2 = dispositivo.imei2,
                    procesador = dispositivo.procesador,
                    ram = dispositivo.ram,
                    almacenamiento = dispositivo.almacenamiento,
                    tenable = dispositivo.tenable,
                    cuentaGmailActual = dispositivo.cuentaGmailActual,
                    contrasenaGmailActual = dispositivo.contrasenaGmailActual,
                    cuentaGmailAnterior = dispositivo.cuentaGmailAnterior,
                    contrasenaGmailAnterior = dispositivo.contrasenaGmailAnterior,
                    ofimatica = dispositivo.ofimatica,
                    sistemaOperativoMovil = dispositivo.sistemaOperativoMovil,
                    dispositivoId = id,
                    item = dispositivo.item,
                    serial = dispositivo.serial,
                    modelo = dispositivo.modelo,
                    marca = dispositivo.marca,
                    categoria = dispositivo.categoria,
                    sede = dispositivo.sede,
                    estado = dispositivo.estado,
                    clasificacion = if (dispositivo.estado.name == "BAJA") "OBSOLETO" else "MEDIA",
                    fechaAdquisicion = dispositivo.fechaAdquisicion,
                    costo = dispositivo.costo,
                    funcional = dispositivo.funcional,
                    codigoActivo = dispositivo.codigoActivo,
                    tipo = dispositivo.tipo,
                    observaciones = dispositivo.observaciones,
                )
                is Pda -> Pda(
                    item = dispositivo.item,
                    numeroPda = dispositivo.numeroPda,
                    sistemaOperativoPda = dispositivo.sistemaOperativoPda,
                    emailAsociado = dispositivo.emailAsociado,
                    contrasenaEmail = dispositivo.contrasenaEmail,
                    dispositivoId = id,
                    serial = dispositivo.serial,
                    modelo = dispositivo.modelo,
                    marca = dispositivo.marca,
                    categoria = dispositivo.categoria,
                    sede = dispositivo.sede,
                    estado = dispositivo.estado,
                    clasificacion = if (dispositivo.estado.name == "BAJA") "OBSOLETO" else "BAJA",
                    fechaAdquisicion = dispositivo.fechaAdquisicion,
                    costo = dispositivo.costo,
                    codigoActivo = dispositivo.codigoActivo,
                    tipo = dispositivo.tipo,
                    observaciones = dispositivo.observaciones,
                )
                is Impresora -> Impresora(
                    item = dispositivo.item,
                    ipAsignada = dispositivo.ipAsignada,
                    contrasenaDispositivo = dispositivo.contrasenaDispositivo,
                    tecnologiaImpresion = dispositivo.tecnologiaImpresion,
                    dispositivoId = id,
                    serial = dispositivo.serial,
                    modelo = dispositivo.modelo,
                    marca = dispositivo.marca,
                    categoria = dispositivo.categoria,
                    sede = dispositivo.sede,
                    estado = dispositivo.estado,
                    clasificacion = if (dispositivo.estado.name == "BAJA") "OBSOLETO" else "BAJA",
                    fechaAdquisicion = dispositivo.fechaAdquisicion,
                    costo = dispositivo.costo,
                    funcional = dispositivo.funcional,
                    codigoActivo = dispositivo.codigoActivo,
                    tipo = dispositivo.tipo,
                    observaciones = dispositivo.observaciones,
                )
                is Videobeam -> Videobeam(
                    item = dispositivo.item,
                    tipoConexion = dispositivo.tipoConexion,
                    resolucionNativa = dispositivo.resolucionNativa,
                    dispositivoId = id,
                    serial = dispositivo.serial,
                    modelo = dispositivo.modelo,
                    marca = dispositivo.marca,
                    categoria = dispositivo.categoria,
                    sede = dispositivo.sede,
                    estado = dispositivo.estado,
                    clasificacion = if (dispositivo.estado.name == "BAJA") "OBSOLETO" else "BAJA",
                    fechaAdquisicion = dispositivo.fechaAdquisicion,
                    costo = dispositivo.costo,
                    funcional = dispositivo.funcional,
                    codigoActivo = dispositivo.codigoActivo,
                    tipo = dispositivo.tipo,
                    observaciones = dispositivo.observaciones,
                )
                is Biometrico -> Biometrico(
                    item = dispositivo.item,
                    ipAsignada = dispositivo.ipAsignada,
                    tipoBiometrico = dispositivo.tipoBiometrico,
                    dispositivoId = id,
                    serial = dispositivo.serial,
                    modelo = dispositivo.modelo,
                    marca = dispositivo.marca,
                    categoria = dispositivo.categoria,
                    sede = dispositivo.sede,
                    estado = dispositivo.estado,
                    clasificacion = if (dispositivo.estado.name == "BAJA") "OBSOLETO" else "BAJA",
                    fechaAdquisicion = dispositivo.fechaAdquisicion,
                    costo = dispositivo.costo,
                    funcional = dispositivo.funcional,
                    codigoActivo = dispositivo.codigoActivo,
                    tipo = dispositivo.tipo,
                    observaciones = dispositivo.observaciones,
                )
                is Camara -> Camara(
                    item = dispositivo.item,
                    macAddress = dispositivo.macAddress,
                    ipAsignada = dispositivo.ipAsignada,
                    tipoCamara = dispositivo.tipoCamara,
                    dispositivoId = id,
                    serial = dispositivo.serial,
                    modelo = dispositivo.modelo,
                    marca = dispositivo.marca,
                    categoria = dispositivo.categoria,
                    sede = dispositivo.sede,
                    estado = dispositivo.estado,
                    clasificacion = if (dispositivo.estado.name == "BAJA") "OBSOLETO" else "BAJA",
                    fechaAdquisicion = dispositivo.fechaAdquisicion,
                    costo = dispositivo.costo,
                    funcional = dispositivo.funcional,
                    codigoActivo = dispositivo.codigoActivo,
                    tipo = dispositivo.tipo,
                    observaciones = dispositivo.observaciones,
                )
                is Intercomunicador -> Intercomunicador(
                    item = dispositivo.item,
                    numeroSerieCompleto = dispositivo.numeroSerieCompleto,
                    accesoriosIncluidos = dispositivo.accesoriosIncluidos,
                    fechaInstalacion = dispositivo.fechaInstalacion,
                    fechaRetiro = dispositivo.fechaRetiro,
                    dispositivoId = id,
                    serial = dispositivo.serial,
                    modelo = dispositivo.modelo,
                    marca = dispositivo.marca,
                    categoria = dispositivo.categoria,
                    sede = dispositivo.sede,
                    estado = dispositivo.estado,
                    clasificacion = if (dispositivo.estado.name == "BAJA") "OBSOLETO" else "BAJA",
                    fechaAdquisicion = dispositivo.fechaAdquisicion,
                    costo = dispositivo.costo,
                    funcional = dispositivo.funcional,
                    codigoActivo = dispositivo.codigoActivo,
                    tipo = dispositivo.tipo,
                    observaciones = dispositivo.observaciones,
                )
                else -> {
                    object : Dispositivo(
                        item = dispositivo.item,
                        dispositivoId = id,
                        serial = dispositivo.serial,
                        modelo = dispositivo.modelo,
                        marca = dispositivo.marca,
                        categoria = dispositivo.categoria,
                        sede = dispositivo.sede,
                        estado = dispositivo.estado,
                        clasificacion = if (dispositivo.estado.name == "BAJA") "OBSOLETO" else "BAJA",
                        fechaAdquisicion = dispositivo.fechaAdquisicion,
                        costo = dispositivo.costo,
                        funcional = dispositivo.funcional,
                        codigoActivo = dispositivo.codigoActivo,
                        tipo = dispositivo.tipo,
                        observaciones = dispositivo.observaciones,
                    ) {}
                }
            }
            dispositivoRepository.save(actualizado)
        } else null
    }
    fun delete(id: Long) = dispositivoRepository.deleteById(id)

    fun <T : Dispositivo> findAllByType(type: Class<T>): List<T> =
        dispositivoRepository.findAll().filterIsInstance(type)

    fun <T : Dispositivo> findByIdAndType(id: Long, type: Class<T>): T? =
        dispositivoRepository.findById(id).orElse(null)?.let { if (type.isInstance(it)) it as T else null }

    fun findBySerial(serial: String?): Dispositivo? = dispositivoRepository.findBySerial(serial)

    @Transactional
    fun actualizarEstado(id: Long, estado: EstadoDispositivo) {
        dispositivoRepository.actualizarEstado(id, estado)
    }

    /**
     * Valida y actualiza el estado de un dispositivo basado en sus asignaciones
     * Si tiene una asignación ACTIVA -> estado = ASIGNADO
     * Si todas las asignaciones están INACTIVA o FINALIZADA -> estado = DISPONIBLE
     */
    @Transactional
    fun validarYActualizarEstadoDispositivo(dispositivoId: Long): EstadoDispositivo {
        val dispositivo = findById(dispositivoId) 
            ?: throw IllegalArgumentException("Dispositivo no encontrado con ID: $dispositivoId")
        
        // Buscar todas las asignaciones del dispositivo
        val asignaciones = asignacionRepository.findByDispositivo_DispositivoId(dispositivoId)
        
        // Verificar si hay alguna asignación activa
        val tieneAsignacionActiva = asignaciones.any { it.estado == Asignacion.EstadoAsignacion.ACTIVA }
        
        val nuevoEstado = if (tieneAsignacionActiva) {
            EstadoDispositivo.ASIGNADO
        } else {
            EstadoDispositivo.DISPONIBLE
        }
        
        // Solo actualizar si el estado es diferente
        if (dispositivo.estado != nuevoEstado) {
            actualizarEstado(dispositivoId, nuevoEstado)
            println("Estado del dispositivo ${dispositivo.serial} actualizado de ${dispositivo.estado} a $nuevoEstado")
        }
        
        return nuevoEstado
    }

    /**
     * Valida y actualiza el estado de todos los dispositivos
     * Útil para sincronizar estados después de cambios masivos
     */
    @Transactional
    fun validarYActualizarEstadosTodosDispositivos() {
        val dispositivos = findAll()
        var actualizados = 0
        
        dispositivos.forEach { dispositivo ->
            try {
                val estadoAnterior = dispositivo.estado
                val nuevoEstado = validarYActualizarEstadoDispositivo(dispositivo.dispositivoId)
                if (estadoAnterior != nuevoEstado) {
                    actualizados++
                }
            } catch (e: Exception) {
                println("Error al validar estado del dispositivo ${dispositivo.serial}: ${e.message}")
            }
        }
        
        println("Validación completada. $actualizados dispositivos actualizados.")
    }
} 