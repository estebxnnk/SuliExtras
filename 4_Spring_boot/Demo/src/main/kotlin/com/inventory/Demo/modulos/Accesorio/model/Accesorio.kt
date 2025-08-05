package com.inventory.Demo.modulos.Accesorio.model

import com.inventory.Demo.modulos.Dispositivo.model.Dispositivo
import com.inventory.Demo.modulos.Dispositivo.model.EstadoDispositivo
import com.inventory.Demo.modulos.Categoria.model.Categoria
import com.inventory.Demo.modulos.Sede.model.Sede
import jakarta.persistence.*
import java.time.LocalDate

@Entity
@Table(name = "accesorios")
@DiscriminatorValue("ACCESORIO")
class Accesorio(
    // Propiedades heredadas de Dispositivo
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
    
    // Propiedades específicas de Accesorio
    @Column(nullable = false, length = 50)
    val tipoAccesorio: String,               // Ej: "Cargador", "Audífonos", "Mouse", etc.

    @Column(nullable = false)
    val esCombo: Boolean = false

) : Dispositivo(
    dispositivoId = dispositivoId,
    item = item,
    serial = serial,
    modelo = modelo,
    marca = marca,
    categoria = categoria,
    sede = sede,
    estado = estado,
    clasificacion = clasificacion,
    fechaAdquisicion = fechaAdquisicion,
    costo = costo,
    funcional = funcional,
    codigoActivo = codigoActivo,
    tipo = tipo,
    observaciones = observaciones
)