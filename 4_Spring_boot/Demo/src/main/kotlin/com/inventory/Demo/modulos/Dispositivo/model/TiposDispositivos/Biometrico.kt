package com.inventory.Demo.modulos.Dispositivo.model.TiposDispositivos

import com.inventory.Demo.modulos.Empleado.model.Empleado
import com.inventory.Demo.modulos.Sede.model.Sede
import com.inventory.Demo.modulos.Categoria.model.Categoria
import com.inventory.Demo.modulos.Dispositivo.model.Dispositivo
import com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo
import jakarta.persistence.Column
import jakarta.persistence.DiscriminatorValue
import jakarta.persistence.Entity
import jakarta.persistence.Table
import java.time.LocalDate

@Entity
@DiscriminatorValue("BIOMETRICO")
@Table(name = "biometricos")
class Biometrico(
    @Column(name = "ip_asignada", length = 50)
    val ipAsignada: String? = null,

    @Column(name = "tipo_biometrico", length = 100)
    val tipoBiometrico: String? = null,

    // Campos heredados
    dispositivoId: Long = 0,
    serial: String,
    modelo: String,
    marca: String,
    categoria: Categoria? = null,
    sede: Sede? = null,
    estado: EstadoDispositivo,
    fechaAdquisicion: LocalDate? = null,
    costo: Double? = null,
    codigoActivo: String,
    tipo: String,
    observaciones: String? = null
) : Dispositivo(
    dispositivoId, serial, modelo, marca, categoria, sede, estado, fechaAdquisicion, costo, codigoActivo, tipo, observaciones
)