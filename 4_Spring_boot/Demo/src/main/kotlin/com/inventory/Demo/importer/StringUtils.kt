package com.inventory.Demo.importer

fun String?.toBooleanSi(): Boolean {
    return this?.trim()?.equals("si", ignoreCase = true) == true
} 