const express = require('express')
const router = express.Router()
const testController = require('../controller/testController')
const multer = require ('multer')
const upload = require ('../uploadImage')
require('dotenv').config()
                             /* ---->   API   <--- */

// insert new data
    router.post('/insert_Data',testController.insert_data )
// get all data
    router.get('/allData',testController.allData )
// get a Data  by Id
   router.get('/getData/:id',testController.getData )

// update a Data by Id
   router.put('/updateData/:id',testController.updateData)
// Delete a data by id
   router.delete('/deleteData/:id',testController.deleteData)
// Insert Image on table test1
  
    router.post('/insert', upload.single('images'),testController.insert)

// Insert multiple images with the help of test table id 
    
router.post('/insertImages/:id', upload.array('images', 5), testController.insertImages)

// get data from both table 
router.get('/fetchData/:id' , testController.fetchData)

// get Data for all user from both Table
router.get('/fetchAllData', testController.fetchAllData)

// delete particular image using id

router.delete('/deleteImage/:id/:imageId', testController.deleteImage)

module.exports = router