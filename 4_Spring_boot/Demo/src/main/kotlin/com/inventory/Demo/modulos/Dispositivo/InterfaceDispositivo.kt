package com.inventory.Demo.modulos.Dispositivo

import org.springframework.http.ResponseEntity

interface InterfaceDispositivo<T, ID> {
    fun getAll(): ResponseEntity<List<T>>
    fun getById(id: ID): ResponseEntity<T>
    fun create(entity: T): ResponseEntity<T>
    fun update(id: ID, entity: T): ResponseEntity<T>
    fun delete(id: ID): ResponseEntity<Void>
} 