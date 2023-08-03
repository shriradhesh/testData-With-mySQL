const con  = require('../connection')
const upload = require ('../uploadImage')
const multer = require('multer')







                                        /* --> for test Table <-- */
// insert data

const insert_data = function (req, res) {
   var  { name , email  } = req.body
    var emailCheck = 'SELECT COUNT (*) AS count FROM test WHERE email = ?'
     con.query(emailCheck , [email], function (err , result){
        if(err) throw err
        else{
            if(result[0].count > 0)
            {
                res.status(400).json({ err : 'Email already exists'})
            }
            else
            {
                var sql = 'INSERT INTO test (username , email) VALUES (?,?)';
  
                con.query(sql, [name, email], function (err, result) {
                 if (err) {
                   res.status(500).json({ err: 'there is an Error  ' , err});
                 } else {
                   res.status(200).json({ message : ' Data uploaded Successfully', })
                  
                 }
               });
             }
           
            }

        })
     } 
             
    

     // get all DATA
          const allData = (req , res) => {
            const sql = 'SELECT * FROM test';
          
            con.query(sql, (err, result) => {
              if (err) {
                res.status(500).json({ err: 'Error while getting all data', error: err });
              } else {
                res.status(200).json({ Data: result });
              }
            });
          }

      // getData by ID 
             const getData = (req,res) =>{
              const dataId = req.params.id

              if(!Number.isInteger(+dataId) || +dataId <= 0){
                return res.status(400).json({ error : 'Invalid Data Id'})

              }
              const sql = `SELECT * FROM test WHERE id = ${dataId}`;
              con.query(sql , (err, result)=>{
                if(err)
                {
                  res.status(500).json({ error : 'Error while getting Data', error : err})
                }
                else{
                  if(result.length === 0)
                  {
                    res.status(404).json({ error : 'Data not found'})
            
                  }
                  else{
                    res.status(200).json({ Data : result[0]})
                  }
                }
    
              })
             }
  

    //update Data by Id                 

                      
    const updateData = (req, res) => {
      var dataId = req.params.id;   
      
      var newData = req.body

      if (!Number.isInteger(+dataId) || +dataId <= 0) {
        return res.status(400).json({ error: 'Invalid Data Id' });
      }
        const sql = `UPDATE test SET ? WHERE id = ${dataId}`
      con.query(sql, newData , (err, result) => {
        if (err) {
        
          res.status(500).json({ error: 'Error while updating data' , error : err });
        } else {
              res.status(200).json({ message : 'Data updated Successfully'})
        }
      });
    };
    

       // Delete Data by ID 

       const deleteData = (req,res) =>{
            var dataId = req.params.id;
            if (!Number.isInteger(+dataId) || +dataId <= 0) {
              return res.status(400).json({ error: 'Invalid Data Id' });
            }              
          
           const sql = `DELETE FROM test WHERE id = ${dataId}`;
        con.query(sql, (err, result) => {
          if (err) {
            res.status(500).json({ error: 'Error while deleting Data', error: err });
          } else {
            res.status(200).json({ message: 'Data deleted successfully' });
          }
        });
      }
    

          /*   for test1 table */
          const insert= (req, res) => {
            try {
              if (!req.file) {
                res.status(400).json({ error: 'Please upload an image file.' });
                return;
              }          
              const imagePath = req.file.path;    
              
          
              const sql = `INSERT INTO test1 (images) VALUES ('${imagePath}')`;
              con.query(sql);
          
              res.status(200).json({ message: 'Data inserted successfully!' });
            } catch (err) {
              console.error('Error inserting Data:', err);
              res.status(500).json({ error: 'An error occurred while inserting the Data.' });
            }
          };
          
      // insert multiple images 
    
              
            
          const insertImages = async (req, res) => {
            try {
                const id = req.params.id;
                let images = req.files.map(file => file.filename);
                const checkId = 'SELECT id FROM test WHERE id = ?';
                await con.query(checkId, [id], (err, checkResult) => {
                    if (err) throw err;
                    if (checkResult.length === 0) {
                        return res.status(400).json({ error: '"test" id does not exist' });
                    }
                    else {
                        images.forEach(image => {
                            con.query('INSERT INTO test1 (images, testId) VALUES (?,?) ', [image, id], (err, result) => {
                                if (err) throw err
        
                            })
                        });
                        return res.status(200).json({ message: 'Image uploaded successfully' });
                    }
        
                });
            } catch (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error while uploading images' });
            }
        }
    // get data from table 1 and table 2
            const fetchData = (req,res)=>{
                try{
                     const id = req.params.id;

                     if(!Number.isInteger(+id) || +id <= 0){
                      return res.status(400).json({ error : 'Invalid Id'})
      
                    }
                       const sql = `SELECT test.username, test.email , test1.images
                       FROM test
                       INNER JOIN test1 ON test.id = test1.testId
                       WHERE test.id = ?`;
                      con.query(sql , [id] ,(err , result)=>{
                        if(err){
                          res.status(500).json({ err :' Error while getting the data',error : err})
                        }
                        else{
                          if(result.length == 0)
                          {
                            res.status(404).json({ err : 'Data not found'})
                          }
                          else{
                            const images = result.map(row => row.images);
                            res.status(200).json({ data : { username: result[0].username , email : result[0].email , images}})
                          }
                        }
                      })
                } catch(err)
                {
                  console.error('error' , err);
                }
              }

          // fetch all Data from table1 and table 2
        
          const fetchAllData = (req, res) => {
            try {
                const sql = `SELECT test.username, test.email, test1.images
                             FROM test
                             INNER JOIN test1 ON test.id = test1.testId `;
          
                con.query(sql, (err, result) => {
                    if (err) {
                        return res.status(500).json({ err: 'Error while getting the data', error: err });
                    } else {
                        if (result.length === 0) {
                            return res.status(404).json({ err: 'Data not found' });
                        } else {
                            const Data = {};
        
                            result.forEach(row => {
                                if (!Data[row.username]) {
                                    Data[row.username] = {
                                        username: row.username,
                                        email: row.email,
                                        images: []
                                    };
                                }
        
                                if (row.images) {
                                    Data[row.username].images.push(row.images);
                                }
                            });
        
                            const formattedData = Object.values(Data);
        
                            return res.status(200).json({success : true ,  Data: formattedData });
                        }
                    }
                });
            } catch (err) {
                console.error('Error', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
        };
        

  // Delete particular image from  user id 
  
        const deleteImage = async(req,res)=>{
          try{
            const id = req.params.id;
            const imageId = req.params.imageId

            if(!Number.isInteger(+id) || +id <= 0){
              return res.status(400).json({ error : 'Invalid Data Id'})
            }

             const sql = `DELETE FROM test1 WHERE testId = ? AND id = ? `       
          

              con.query(sql , [id , imageId], (err, result)=>{
                if(err){
                  res.status(500).json({ err : 'ERROR while deleting the image', error : err})
                }
                else {
                  if(result.affectedRows === 0)
                  {
                    res.status(404).json({ err : 'Image not found'})
                  }
                  else{
                      res.status(200).json({ message : 'Image Deleted Successfully'})
                  }
                }
              })

          }catch(err){
              console.error('error' , err);
              res.status(500).json({ err : ' An error occured '})
          }
        }


        // Api for term and condition 

        const termAndCondition = (req, res) => {
          const data = req.body;
      
          var updateQuery = `UPDATE term_and_condition SET description = ? , heading = ?`;
          var updateValues = [data.description, data.heading];
      
          con.query(updateQuery, updateValues, (err, result) => {
              if (err) {
                  console.error('Error updating terms', err);
                  return res.status(500).json({ err: 'An error occurred while updating term' });
              } else {
                  if (result.affectedRows === 0) {
                      var insertQuery = `INSERT INTO term_and_condition(heading, description) VALUES (?, ?)`;
                      var insertValues = [data.heading, data.description];
      
                      con.query(insertQuery, insertValues, (err, result) => {
                          if (err) {
                              console.error('There is an error while inserting', err);
                              return res.status(500).json({ err: 'Error while inserting the term' });
                          } else {
                              const id = result.insertId; 
                              return res.status(200).json({ message: 'Term inserted successfully', id : id});
                          }
                      });
                  } else {
                      
                      return res.status(200).json({ message: 'Term updated successfully' , success: true });
                  }
              }
          });
      };
      
      
      
      
      
      module.exports = { insert_data , allData , getData , updateData , deleteData , insert , insertImages , fetchData , fetchAllData , deleteImage , termAndCondition}