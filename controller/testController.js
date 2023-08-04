const con  = require('../connection')
const upload = require ('../uploadImage')
const multer = require('multer')
const bcrypt = require('bcrypt')

                                        /* --> for test Table <-- */
// insert data



const insert_data = function (req, res) {
  const { username, email, password, status } = req.body; 

  const emailCheck = 'SELECT COUNT(*) AS count FROM test WHERE email = ?';
  con.query(emailCheck, [email], function (err, result) {
    if (err) {
      throw err;
    } else {
      if (result[0].count > 0) {
        res.status(400).json({ err: 'Email already exists' });
      } else {
        bcrypt.hash(password, 10, function (err, hashedPassword) { 
          if (err) {
            console.error('Error hasing password' , err);
            res.status(500).json({ err: 'Error hashing password', error: err });
          } else {

            const sql = 'INSERT INTO test (username, email, password, status) VALUES (?, ?, ?, ?)';
            con.query(sql, [username, email, hashedPassword, status], function (err, result) {
              if (err) {
                res.status(500).json({ err: 'There is an Error', error: err });
              } else {
                res.status(200).json({ message: 'Data uploaded Successfully', success: true });
              }
            });
          }
        });
      }
    }
  });
};

    
     // get all DATA
          const allData = (req , res) => {
            const sql = 'SELECT * FROM test';
          
            con.query(sql, (err, result) => {
              if (err) {
                res.status(500).json({ err: 'Error while getting all data', error: err });
              } else {
                res.status(200).json({ message : ' ALL user data ' , success : true });
              }
            });
          }

      // getData by ID 
             const getData = (req,res) =>{
              const dataId = req.params.id
              
              const sql = `SELECT * FROM test WHERE id = ${dataId}`;
              con.query(sql , (err, result)=>{
                if(err)
                {
                  res.status(500).json({ error : 'Error while getting Data', error : err ,success : false })
                }
                else{
                  if(result.length === 0)
                  {
                    res.status(404).json({ error : 'Invalid Data Id ' , success : false })
            
                  }
                  else{
                    res.status(200).json({ message : result , success : true })
                  }
                }
    
              })
             }
  
    //update Data by Id  
              const updateData = (req, res) => {
                const dataId = req.params.id;
                const newData = req.body;
                const checkId = 'SELECT id FROM test WHERE id = ?';
                
                con.query(checkId, [dataId], (err, checkResult) => {
                  if (err) {
                    return res.status(500).json({ error: 'Error while checking ID existence', success: false, error: err });
                  }
                  
                  if (checkResult.length === 0) {
                    return res.status(400).json({ error: 'test id does not exist', success: false });
                  } else {
                    const checkEmail = `SELECT email FROM test WHERE id = ?`;
              
                    con.query(checkEmail, [dataId], (err, rows) => {
                      if (err) {
                        return res.status(500).json({ error: 'Error while fetching the existing email', success: false, error: err });
                      }
              
                      if (rows.length === 0) {
                        return res.status(404).json({ error: 'Email not found', success: false });
                      }
              
                      const existingEmail = rows[0].email;
              
                      if (newData.email && newData.email === existingEmail) {
                        const updateSql = 'UPDATE test SET ? WHERE id = ?';
                        con.query(updateSql, [newData, dataId], (err, result) => {
                          if (err) {
                            return res.status(500).json({ error: 'Error while updating the data', success: false, error: err });
                          }
                          return res.status(200).json({ message: 'Data updated successfully', success: true });
                        });
                      } else {
                        const checkEmailQuery = 'SELECT id FROM test WHERE email = ?';
                        con.query(checkEmailQuery, [newData.email], (err, rows) => {
                          if (err) {
                            return res.status(500).json({ error: 'Error while checking email existence', success: false, error: err });
                          }
              
                          if (rows.length > 0) {
                            return res.status(400).json({ error: 'Email already exists', success: false });
                          }
              
                          const updateSql = 'UPDATE test SET ? WHERE id = ?';
                          con.query(updateSql, [newData, dataId], (err, result) => {
                            if (err) {
                              return res.status(500).json({ error: 'Error while updating the data', success: false, error: err });
                            }
                            return res.status(200).json({ message: 'Data updated successfully', success: true });
                          });
                        });
                      }
                    });
                  }
                });
              };
   
       // Delete Data by ID 

       const deleteData = (req,res) =>{
            var dataId = req.params.id;
            const checkId = 'SELECT id FROM test WHERE id = ?';
                
            con.query(checkId, [dataId], (err, checkResult) => {
              if (err) {
                return res.status(500).json({ error: 'Error while checking ID existence', success: false, error: err });
              }
              
              if (checkResult.length === 0) {
                return res.status(400).json({ error: 'test id does not exist', success: false });
              } else{           
          
           const sql = `DELETE FROM test WHERE id = ${dataId}`;
        con.query(sql, (err, result) => {
          if (err) {
            res.status(500).json({ error: 'Error while deleting Data', success: false ,error: err });
          } else {
            res.status(200).json({ message: 'Data deleted successfully', success: true });
          }
        });
      }
    })
  }
    
          /*  Insert DATA for test1 table */
          const insert= (req, res) => {
            try {
              if (!req.file) {
                res.status(400).json({ error: 'Please upload an image file.' , success: false});
                return;
              }          
              const imagePath = req.file.path;    
              
          
              const sql = `INSERT INTO test1 (images) VALUES ('${imagePath}')`;
              con.query(sql);
          
              res.status(200).json({ message: 'Data inserted successfully!' , success: true });
            } catch (err) {
              console.error('Error inserting Data:', err);
              res.status(500).json({ error: 'An error occurred while inserting the Data.' , success: false });
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
                        return res.status(400).json({ error: '"test" id does not exist' , success: false });
                    }
                    else {
                        images.forEach(image => {
                            con.query('INSERT INTO test1 (images, testId) VALUES (?,?) ', [image, id], (err, result) => {
                                if (err) throw err
        
                            })
                        });
                        return res.status(200).json({ message: 'Image uploaded successfully' , success: true });
                    }
        
                });
            } catch (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error while uploading images' , success: false });
            }
        }
    // get data from table 1 and table 2
            const fetchData = (req,res)=>{
                try{
                     const id = req.params.id;

                       const sql = `SELECT test.username, test.email , test.sttaus , test1.images
                       FROM test
                       INNER JOIN test1 ON test.id = test1.testId
                       WHERE test.id = ?`;
                      con.query(sql , [id] ,(err , result)=>{
                        if(err){
                          res.status(500).json({ err :' Error while getting the data',success: false ,error : err})
                        }
                        else{
                          if(result.length == 0)
                          {
                            res.status(404).json({ err : 'Data not found' , success: false})
                          }
                          else{
                            const images = result.map(row => row.images);
                            res.status(200).json({ data : { username: result[0].username , email : result[0].email , status: result[0].status, images}})
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
                const sql = `SELECT test.username, test.email,test.status, test1.images
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
                                        images: [],
                                        status : row.status
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

            const checkId = 'SELECT id FROM test WHERE id = ?';
                
            con.query(checkId, [id], (err, checkResult) => {
              if (err) {
                return res.status(500).json({ error: 'Error while checking ID existence', success: false, error: err });
              }
              
              if (checkResult.length === 0) {
                return res.status(400).json({ error: ' Id does not exist', success: false });
              } else{
             const sql = `DELETE FROM test1 WHERE testId = ? AND id = ? `       
          

              con.query(sql , [id , imageId], (err, result)=>{
                if(err){
                  res.status(500).json({ err : 'ERROR while deleting the image', error : err , success : false })
                }
                else {
                  if(result.affectedRows === 0)
                  {
                    res.status(404).json({ err : 'Image not found' , success : false})
                  }
                  else{
                      res.status(200).json({ message : 'Image Deleted Successfully' , success : true})
                  }
                }
              })
            }
          
          })
        
          }catch(err){
              console.error('error' , err);
              res.status(500).json({ err : ' An error occured '})
          }
        }

        // Api for term and condition for ( TERM AND CONDITION TABLE )

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
     
       // API FOR CHECK STATUS
     
       const checkAndToggleStatus = (req, res) => {
        const id = req.params.id
      
        const sqlSelect = 'SELECT status FROM test WHERE id = ?'
        const sqlUpdate = 'UPDATE test SET status = ? WHERE id = ?'
      
        con.query(sqlSelect, [id], (err, result) => {
          if (err) {
            console.error('Error while checking the status:', err)
            res.status(404).json({ error : err })
            return;
          }      

          if (result.length > 0) {
            const currentStatus = result[0].status
            const newStatus = 1 - currentStatus
      
            
            con.query(sqlUpdate, [newStatus, id], (err, result) => {
              if (err) {
                console.error('Error while updating status', err)
                res.status(500).json({ error: 'Internal server error' })
              } else {
                   
                res.status(200).json({  message : ' your Status has been changed ', success : true })
              }
            })
          } else {
            res.status(404).json({ error: 'Test ID not found' })
          }
        })
      } 

      module.exports = { insert_data , allData , 
                          getData , updateData , deleteData ,
                           insert , insertImages , fetchData ,
                            fetchAllData , deleteImage , termAndCondition,
                             checkAndToggleStatus}