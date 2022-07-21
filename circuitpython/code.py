import board
import busio
from time import sleep
import sys

uart = busio.UART(board.TX, board.RX, baudrate=9600)

while True:
    received_data = (str)(uart.readline()) #read NMEA string received
    print(received_data, '\n')
