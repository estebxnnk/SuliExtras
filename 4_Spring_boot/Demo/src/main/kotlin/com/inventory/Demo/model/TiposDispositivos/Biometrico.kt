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