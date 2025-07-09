package com.inventory.Demo.dto

data class EmpleadoRequest(
    val nombre: String,
    val email: String?,
    val departamento: String?,
    val sedeId: Long
) 