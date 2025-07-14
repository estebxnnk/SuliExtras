package com.inventory.Demo.modulos.Asignacion.service

import com.inventory.Demo.modulos.Asignacion.model.Asignacion
import com.inventory.Demo.modulos.Asignacion.model.EstadoAsignacion
import com.inventory.Demo.modulos.Asignacion.repository.AsignacionRepository
import com.inventory.Demo.modulos.Dispositivo.service.DispositivoService
import org.springframework.stereotype.Service

@Service
class AsignacionService(
    private val asignacionRepository: AsignacionRepository,
    private val dispositivoService: DispositivoService
) {
    fun findAll(): List<Asignacion> = asignacionRepository.findAll()
    fun findById(id: Long): Asignacion? = asignacionRepository.findById(id).orElse(null)
    fun save(asignacion: Asignacion): Asignacion = asignacionRepository.save(asignacion)
    fun delete(id: Long) = asignacionRepository.deleteById(id)

    fun reasignarDispositivo(dispositivoId: Long, nuevaAsignacion: Asignacion): Asignacion {
        // Buscar asignación activa actual y marcarla como INACTIVA
        val asignacionActiva = asignacionRepository.findByDispositivo_DispositivoIdAndEstado(dispositivoId, EstadoAsignacion.ACTIVA)
        if (asignacionActiva != null) {
            val inactiva = Asignacion(
                asignacionId = asignacionActiva.asignacionId,
                dispositivo = asignacionActiva.dispositivo,
                empleado = asignacionActiva.empleado,
                fechaAsignacion = asignacionActiva.fechaAsignacion,
                fechaFinalizacion = nuevaAsignacion.fechaAsignacion,
                motivoFinalizacion = asignacionActiva.motivoFinalizacion,
                estado = EstadoAsignacion.INACTIVA,
                fechaDevolucion = asignacionActiva.fechaDevolucion,
                comentario = asignacionActiva.comentario,
                observaciones = asignacionActiva.observaciones
            )
            asignacionRepository.save(inactiva)
        }
        // Guardar la nueva asignación como ACTIVA
        val nuevaAsignacionActiva = Asignacion(
            asignacionId = nuevaAsignacion.asignacionId,
            dispositivo = nuevaAsignacion.dispositivo,
            empleado = nuevaAsignacion.empleado,
            fechaAsignacion = nuevaAsignacion.fechaAsignacion,
            fechaFinalizacion = nuevaAsignacion.fechaFinalizacion,
            motivoFinalizacion = nuevaAsignacion.motivoFinalizacion,
            estado = EstadoAsignacion.ACTIVA,
            fechaDevolucion = nuevaAsignacion.fechaDevolucion,
            comentario = nuevaAsignacion.comentario,
            observaciones = nuevaAsignacion.observaciones
        )
        return asignacionRepository.save(nuevaAsignacionActiva)
    }

    fun eliminarAsignacionYActualizarDispositivo(asignacionId: Long) {
        val asignacion = asignacionRepository.findById(asignacionId).orElse(null) ?: return
        asignacionRepository.deleteById(asignacionId)
        // Cambiar el estado del dispositivo a DISPONIBLE si no tiene otra asignación activa
        val dispositivoId = asignacion.dispositivo.dispositivoId
        val otraAsignacionActiva = asignacionRepository.findByDispositivo_DispositivoIdAndEstado(dispositivoId, EstadoAsignacion.ACTIVA)
        if (otraAsignacionActiva == null) {
            val dispositivo = dispositivoService.findById(dispositivoId)
            if (dispositivo != null) {
                when (dispositivo) {
                    is com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Computador -> {
                        val dispositivoDisponible = com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Computador(
                            procesador = dispositivo.procesador,
                            ram = dispositivo.ram,
                            almacenamiento = dispositivo.almacenamiento,
                            sistemaOperativo = dispositivo.sistemaOperativo,
                            softwareAdicional = dispositivo.softwareAdicional,
                            dispositivoId = dispositivo.dispositivoId,
                            serial = dispositivo.serial,
                            modelo = dispositivo.modelo,
                            marca = dispositivo.marca,
                            categoria = dispositivo.categoria,
                            sede = dispositivo.sede,
                            estado = com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo.DISPONIBLE,
                            fechaAdquisicion = dispositivo.fechaAdquisicion,
                            costo = dispositivo.costo,
                            codigoActivo = dispositivo.codigoActivo,
                            tipo = dispositivo.tipo,
                            observaciones = dispositivo.observaciones
                        )
                        dispositivoService.save(dispositivoDisponible)
                    }
                    is com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Celular -> {
                        val dispositivoDisponible = com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Celular(
                            imei1 = dispositivo.imei1,
                            imei2 = dispositivo.imei2,
                            sistemaOperativoMovil = dispositivo.sistemaOperativoMovil,
                            emailAsociado = dispositivo.emailAsociado,
                            contrasenaEmail = dispositivo.contrasenaEmail,
                            capacidadSim = dispositivo.capacidadSim,
                            dispositivoId = dispositivo.dispositivoId,
                            serial = dispositivo.serial,
                            modelo = dispositivo.modelo,
                            marca = dispositivo.marca,
                            categoria = dispositivo.categoria,
                            sede = dispositivo.sede,
                            estado = com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo.DISPONIBLE,
                            fechaAdquisicion = dispositivo.fechaAdquisicion,
                            costo = dispositivo.costo,
                            codigoActivo = dispositivo.codigoActivo,
                            tipo = dispositivo.tipo,
                            observaciones = dispositivo.observaciones
                        )
                        dispositivoService.save(dispositivoDisponible)
                    }
                    is com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Impresora -> {
                        val dispositivoDisponible = com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Impresora(
                            ipAsignada = dispositivo.ipAsignada,
                            contrasenaDispositivo = dispositivo.contrasenaDispositivo,
                            tecnologiaImpresion = dispositivo.tecnologiaImpresion,
                            dispositivoId = dispositivo.dispositivoId,
                            serial = dispositivo.serial,
                            modelo = dispositivo.modelo,
                            marca = dispositivo.marca,
                            categoria = dispositivo.categoria,
                            sede = dispositivo.sede,
                            estado = com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo.DISPONIBLE,
                            fechaAdquisicion = dispositivo.fechaAdquisicion,
                            costo = dispositivo.costo,
                            codigoActivo = dispositivo.codigoActivo,
                            tipo = dispositivo.tipo,
                            observaciones = dispositivo.observaciones
                        )
                        dispositivoService.save(dispositivoDisponible)
                    }
                    is com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Pda -> {
                        val dispositivoDisponible = com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Pda(
                            numeroPda = dispositivo.numeroPda,
                            sistemaOperativoPda = dispositivo.sistemaOperativoPda,
                            emailAsociado = dispositivo.emailAsociado,
                            contrasenaEmail = dispositivo.contrasenaEmail,
                            dispositivoId = dispositivo.dispositivoId,
                            serial = dispositivo.serial,
                            modelo = dispositivo.modelo,
                            marca = dispositivo.marca,
                            categoria = dispositivo.categoria,
                            sede = dispositivo.sede,
                            estado = com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo.DISPONIBLE,
                            fechaAdquisicion = dispositivo.fechaAdquisicion,
                            costo = dispositivo.costo,
                            codigoActivo = dispositivo.codigoActivo,
                            tipo = dispositivo.tipo,
                            observaciones = dispositivo.observaciones
                        )
                        dispositivoService.save(dispositivoDisponible)
                    }
                    is com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Biometrico -> {
                        val dispositivoDisponible = com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Biometrico(
                            ipAsignada = dispositivo.ipAsignada,
                            tipoBiometrico = dispositivo.tipoBiometrico,
                            dispositivoId = dispositivo.dispositivoId,
                            serial = dispositivo.serial,
                            modelo = dispositivo.modelo,
                            marca = dispositivo.marca,
                            categoria = dispositivo.categoria,
                            sede = dispositivo.sede,
                            estado = com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo.DISPONIBLE,
                            fechaAdquisicion = dispositivo.fechaAdquisicion,
                            costo = dispositivo.costo,
                            codigoActivo = dispositivo.codigoActivo,
                            tipo = dispositivo.tipo,
                            observaciones = dispositivo.observaciones
                        )
                        dispositivoService.save(dispositivoDisponible)
                    }
                    is com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Camara -> {
                        val dispositivoDisponible = com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Camara(
                            macAddress = dispositivo.macAddress,
                            ipAsignada = dispositivo.ipAsignada,
                            tipoCamara = dispositivo.tipoCamara,
                            dispositivoId = dispositivo.dispositivoId,
                            serial = dispositivo.serial,
                            modelo = dispositivo.modelo,
                            marca = dispositivo.marca,
                            categoria = dispositivo.categoria,
                            sede = dispositivo.sede,
                            estado = com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo.DISPONIBLE,
                            fechaAdquisicion = dispositivo.fechaAdquisicion,
                            costo = dispositivo.costo,
                            codigoActivo = dispositivo.codigoActivo,
                            tipo = dispositivo.tipo,
                            observaciones = dispositivo.observaciones
                        )
                        dispositivoService.save(dispositivoDisponible)
                    }
                    is com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Intercomunicador -> {
                        val dispositivoDisponible = com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Intercomunicador(
                            numeroSerieCompleto = dispositivo.numeroSerieCompleto,
                            accesoriosIncluidos = dispositivo.accesoriosIncluidos,
                            fechaInstalacion = dispositivo.fechaInstalacion,
                            fechaRetiro = dispositivo.fechaRetiro,
                            dispositivoId = dispositivo.dispositivoId,
                            serial = dispositivo.serial,
                            modelo = dispositivo.modelo,
                            marca = dispositivo.marca,
                            categoria = dispositivo.categoria,
                            sede = dispositivo.sede,
                            estado = com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo.DISPONIBLE,
                            fechaAdquisicion = dispositivo.fechaAdquisicion,
                            costo = dispositivo.costo,
                            codigoActivo = dispositivo.codigoActivo,
                            tipo = dispositivo.tipo,
                            observaciones = dispositivo.observaciones
                        )
                        dispositivoService.save(dispositivoDisponible)
                    }
                    is com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Videobeam -> {
                        val dispositivoDisponible = com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos.Videobeam(
                            tipoConexion = dispositivo.tipoConexion,
                            resolucionNativa = dispositivo.resolucionNativa,
                            dispositivoId = dispositivo.dispositivoId,
                            serial = dispositivo.serial,
                            modelo = dispositivo.modelo,
                            marca = dispositivo.marca,
                            categoria = dispositivo.categoria,
                            sede = dispositivo.sede,
                            estado = com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo.DISPONIBLE,
                            fechaAdquisicion = dispositivo.fechaAdquisicion,
                            costo = dispositivo.costo,
                            codigoActivo = dispositivo.codigoActivo,
                            tipo = dispositivo.tipo,
                            observaciones = dispositivo.observaciones
                        )
                        dispositivoService.save(dispositivoDisponible)
                    }
                }
            }
        }
    }
} 