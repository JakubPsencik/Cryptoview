from flask import Flask, render_template, jsonify, request
import config
from binance.client import Client
import asyncio
import aiomysql
import requests
from datetime import datetime, timedelta
import math
import os;

t1 = 1710082800000
t2 = 3600000

nt = t1 + t2 
print(len(str(nt)))
