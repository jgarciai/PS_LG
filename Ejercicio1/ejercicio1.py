#!/usr/bin/env python
# -*- coding: utf-8 -*-

##################################
# Prueba de Codigo - Ejercicio 1 #
# Autor: Jorge Garcia Iglesias   #
##################################

import sys

def getDivisores(n):
  # Devuelve la suma de los divisores de n
  i = 1
  values = []
  while i < n:
    if (n % i) == 0:
      values.append(i)
    i += 1
  return values
  
def sumaDivisores(values):
  suma = 0
  for x in values:
    suma += x
  return suma

def listDivisores(values):
  value = ""
  for x in values:
    if len(value) > 0:
      value += " + "
    value += str(x)
  return value
  
def evaluarNumeros(nums):
  # Evalue cada uno de los numeros y comprueba para cada uno
  # si es un numero perfecto, abundante o defectivo
  for n in nums:
    try:
      n = int(n)
    except ValueError:
      print n, "Numero no valido. Ignorando..."
      continue
    values = getDivisores(n)
    suma = sumaDivisores(values)
    lista = listDivisores(values)
    if suma == n:
      # El numero es perfecto
      print n, "es un numero perfecto:", n, "=", suma, "(", lista, ")"
    elif suma > n:
      # El numero es abundante
      print n, "es un numero abundante:", n, "<", suma, "(", lista, ")"
    else:
      # El numero es defectivo
      print n, "es un numero defectivo:", n, ">", suma, "(", lista, ")"

def main():
  evaluarNumeros(sys.argv[1:])

if __name__ == '__main__':
    main()
