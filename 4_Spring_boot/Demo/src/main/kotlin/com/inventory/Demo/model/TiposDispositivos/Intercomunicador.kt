package com.inventory.Demo.model.TiposDispositivos

import com.inventory.Demo.model.Categoria
import com.inventory.Demo.model.Dispositivo
import com.inventory.Demo.model.Empleado
import com.inventory.Demo.model.EstadoDispositivo
import com.inventory.Demo.model.Sede
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
    serial: String,
    modelo: String,
    marca: String,
    categoria: Categoria,
    sede: Sede,
    empleado: Empleado? = null,
    estado: EstadoDispositivo,
    fechaAdquisicion: LocalDate? = null,
    costo: Double? = null,
    codigoActivo: String,
    tipo: String,
    observaciones: String? = null
) : Dispositivo(
    dispositivoId, serial, modelo, marca, categoria, sede, empleado, estado, fechaAdquisicion, costo, codigoActivo, tipo, observaciones
)