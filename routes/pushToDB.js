const express = require('express')
const mongoose = require('mongoose')

const NGOUser = require('../models/ngouser')

let newNGOUser = new NGOUser({
	name: 'WeLoveNGO',
	contact: 9889889889,
	email: 'welovengo@go.com',
	password: 'hi@1234',
	address:{ streetaddress: 'We are homeless',
	locality: 'nowhere', city: 'city', zip: '123123'}
})

newNGOUser.save();