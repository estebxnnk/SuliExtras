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
@DiscriminatorValue("INTERCOMUNICADOR")
@Table(name = "intercomunicadores")
class Intercomunicador(
    @Column(name = "numero_serie_completo", length = 255)
    val numeroSerieCompleto: String? = null,

    @Column(name = "accesorios_incluidos", length = 1000)
    val accesoriosIncluidos: String? = null,

    @Column(name = "fecha_instalacion")
    val fechaInstalacion: LocalDate? = null,

    @Column(name = "fecha_retiro")
    val fechaRetiro: LocalDate? = null,

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
    accesorios: List<Accesorio> = emptyList()
) : Dispositivo(
    dispositivoId, item, serial, modelo, marca, categoria, sede, estado, clasificacion, fechaAdquisicion, costo, funcional, codigoActivo, tipo, observaciones
)