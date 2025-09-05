package com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos

import com.inventory.Demo.modulos.Categoria.model.Categoria
import com.inventory.Demo.modulos.Empleado.model.Empleado
import com.inventory.Demo.modulos.Sede.model.Sede
import com.inventory.Demo.modulos.Dispositivo.model.Dispositivo
import com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo
import com.inventory.Demo.modulos.Accesorio.model.Accesorio
import jakarta.persistence.Column
import jakarta.persistence.DiscriminatorValue
import jakarta.persistence.Entity
import jakarta.persistence.Table
import java.time.LocalDate

@Entity
@DiscriminatorValue("IMPRESORA")
@Table(name = "impresoras")
class Impresora(
    @Column(name = "ip_asignada", length = 50)
    val ipAsignada: String? = null,

    @Column(name = "contrasena_dispositivo", length = 255)
    val contrasenaDispositivo: String? = null,

    @Column(name = "tecnologia_impresion", length = 100)
    val tecnologiaImpresion: String? = null,

    // Campos heredados
    dispositivoId: Long = 0,
    item: String?,
    serial: String?,
    modelo: String?,
    marca: String?,
    categoria: Categoria? = null,
    sede: Sede? = null,
    estado: EstadoDispositivo,
    clasificacion: String,
    fechaAdquisicion: LocalDate? = null,
    costo: Double? = null,
    funcional: Boolean? = null,
    codigoActivo: String? = null,
    tipo: String?,
    observaciones: String? = null,
) : Dispositivo(
    dispositivoId, item, serial, modelo, marca, categoria, sede, estado, clasificacion, fechaAdquisicion, costo, funcional, codigoActivo, tipo, observaciones
)