package com.inventory.Demo

import org.springframework.boot.CommandLineRunner
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.context.annotation.Bean

@SpringBootApplication
class DemoApplication {
    @Bean
    fun showSwaggerUrl(): CommandLineRunner = CommandLineRunner {
        val dbUrl = System.getenv("DB_URL") ?: "NO DEFINIDA"
        val dbUser = System.getenv("DB_USER") ?: "NO DEFINIDO"
        val dbPass = System.getenv("DB_PASS") ?: "NO DEFINIDA"
        println("--------------------------------------------------")
        println("¡Aplicación iniciada con éxito!")
        println("Accede a Swagger UI en: http://localhost:8080/swagger-ui/index.html")
        println("Base de datos: $dbUrl")
        println("Usuario: $dbUser")
        println("Contraseña (solo para ver si está definida): ${if (dbPass.isNotEmpty()) "DEFINIDA" else "NO DEFINIDA"}")
        println("--------------------------------------------------")
    }
}

fun main(args: Array<String>) {

    runApplication<DemoApplication>(*args)
}
