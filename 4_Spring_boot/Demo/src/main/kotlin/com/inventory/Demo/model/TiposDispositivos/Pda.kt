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
@DiscriminatorValue("PDA")
@Table(name = "pdas")
class Pda(
    @Column(name = "numero_pda", nullable = false, length = 50)
    val numeroPda: String,

    @Column(name = "sistema_operativo_pda", nullable = false, length = 100)
    val sistemaOperativoPda: String,

    @Column(name = "email_asociado", length = 100)
    val emailAsociado: String? = null,

    @Column(name = "contrasena_email", length = 255)
    val contrasenaEmail: String? = null,

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