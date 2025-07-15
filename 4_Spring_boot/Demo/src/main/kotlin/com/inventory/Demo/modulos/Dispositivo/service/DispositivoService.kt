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
import com.inventory.Demo.modulos.Dispositivo.repository.DispositivoRepository
import org.springframework.stereotype.Service

@Service
class DispositivoService(private val dispositivoRepository: DispositivoRepository) {
    fun findAll(): List<Dispositivo> = dispositivoRepository.findAll()
    fun findById(id: Long): Dispositivo? = dispositivoRepository.findById(id).orElse(null)
    fun save(dispositivo: Dispositivo): Dispositivo = dispositivoRepository.save(dispositivo)
    fun update(id: Long, dispositivo: Dispositivo): Dispositivo? {
        return if (dispositivoRepository.existsById(id)) {
            val actualizado = when (dispositivo) {
                is Computador -> Computador(
                    item = dispositivo.item,
                    procesador = dispositivo.procesador,
                    ram = dispositivo.ram,
                    almacenamiento = dispositivo.almacenamiento,
                    almacenamiento2 = dispositivo.almacenamiento2,
                    mac = dispositivo.mac,
                    ofimatica = dispositivo.ofimatica,
                    antivirus = dispositivo.antivirus,
                    sistemaOperativo = dispositivo.sistemaOperativo,
                    softwareAdicional = dispositivo.softwareAdicional,
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
                    codigoActivo = dispositivo.codigoActivo,
                    tipo = dispositivo.tipo,
                    observaciones = dispositivo.observaciones,
                    accesorios = dispositivo.accesorios
                )
                is Celular -> Celular(
                    item = dispositivo.item,
                    imei1 = dispositivo.imei1,
                    imei2 = dispositivo.imei2,
                    sistemaOperativoMovil = dispositivo.sistemaOperativoMovil,
                    emailAsociado = dispositivo.emailAsociado,
                    contrasenaEmail = dispositivo.contrasenaEmail,
                    capacidadSim = dispositivo.capacidadSim,
                    dispositivoId = id,
                    serial = dispositivo.serial,
                    modelo = dispositivo.modelo,
                    marca = dispositivo.marca,
                    categoria = dispositivo.categoria,
                    sede = dispositivo.sede,
                    estado = dispositivo.estado,
                    clasificacion = if (dispositivo.estado.name == "BAJA") "OBSOLETO" else "MEDIA",
                    fechaAdquisicion = dispositivo.fechaAdquisicion,
                    costo = dispositivo.costo,
                    codigoActivo = dispositivo.codigoActivo,
                    tipo = dispositivo.tipo,
                    observaciones = dispositivo.observaciones,
                    accesorios = dispositivo.accesorios
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
                    accesorios = dispositivo.accesorios
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
                    codigoActivo = dispositivo.codigoActivo,
                    tipo = dispositivo.tipo,
                    observaciones = dispositivo.observaciones,
                    accesorios = dispositivo.accesorios
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
                    codigoActivo = dispositivo.codigoActivo,
                    tipo = dispositivo.tipo,
                    observaciones = dispositivo.observaciones,
                    accesorios = dispositivo.accesorios
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
                    codigoActivo = dispositivo.codigoActivo,
                    tipo = dispositivo.tipo,
                    observaciones = dispositivo.observaciones,
                    accesorios = dispositivo.accesorios
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
                    codigoActivo = dispositivo.codigoActivo,
                    tipo = dispositivo.tipo,
                    observaciones = dispositivo.observaciones,
                    accesorios = dispositivo.accesorios
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
                    codigoActivo = dispositivo.codigoActivo,
                    tipo = dispositivo.tipo,
                    observaciones = dispositivo.observaciones,
                    accesorios = dispositivo.accesorios
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
                        codigoActivo = dispositivo.codigoActivo,
                        tipo = dispositivo.tipo,
                        observaciones = dispositivo.observaciones,
                        accesorios = dispositivo.accesorios
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
} 