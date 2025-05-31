var express = require('express');
const router = express.Router();
var Sequelize = require('sequelize');
require('dotenv').config();

  var knex = require("knex")({
    client: 'mssql',
    connection: {
      user: process.env.USER,
      password: process.env.PASSWORD,
      server: process.env.SERVER,
      database: process.env.DATABASE,
      port: parseInt(process.env.APP_SERVER_PORT),
      options: {
        enableArithAbort: true,
       
      }
    },
  });

    var db = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD,{
      host: process.env.SERVER,
      dialect: "mssql",
      port: parseInt(process.env.APP_SERVER_PORT),
    });

    const { DataTypes } = Sequelize;

    const Users = db.define('users_master',{
      id_master:{
        type:DataTypes.INTEGER,
        primaryKey: true
      },
      user_name:{
        type: DataTypes.STRING
      },
      emp_firstname: {
        type: DataTypes.STRING
      },
      emp_lastname: {
        type: DataTypes.STRING
      },
      emp_role:{
        type: DataTypes.STRING
      },
      pass_wrd: {
        type: DataTypes.STRING
      }
    },{
      freezeTableName: false,
      timestamps: false,
      createdAt: false,
      updatedAt: false,
      tableName: 'users_master'
    })

router.get('/login', async function (req, res, next) {
  try {
    const user_name = req.query.user_name; // use query for GET requests

    const user = await Users.findAll({
      where: {
        user_name: user_name
      }
    });

    if (!user || user.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    console.log("The username: ", user[0].user_name);
    console.log("First Name: ", user[0].emp_firstname);
    console.log("Last Name: ", user[0].emp_lastname);
    console.log("Emp Role: ", user[0].emp_role);
    // Avoid logging the password!
    // console.log("The PWD: ", user[0].pass_wrd);

    const result = {
      user_name: user[0].user_name,
      first_name: user[0].emp_firstname,
      last_name: user[0].emp_lastname,
      role: user[0].emp_role,
      // password: user[0].pass_wrd, // don't send password!
    };

    res.json(result);
  } catch (err) {
    console.error("Error during login GET:", err);
    res.status(500).json({ msg: 'Server error' });
  }
});


  router.get('/users', async function (req, res, next) {
      // view all users
      const result = await knex.select('*').from('users_master');
      res.json(result);
      console.log(result)

      //add user
      // const reg = knex('users_master').insert({
      //   PersonID:6,
      //   FirstName: 'Vii',
      //   LastName: 'Digi'
      // })
      // .then(() => {
      //   console.log('saved');
      // })

      //delete user
      // const del = knex('users_master').where('PersonID',6).del().then(() => {
      //   console.log('deleted a user');
      // })

      //EDIT user
      // const edit = knex('users_master')
      //                   .where('PersonID',1)
      //                   .update({
      //                     PersonID: 69,
      //                     FirstName: 'Lala',
      //                     LastName: 'Land'
      //                   })
      // .then(() => {
      //   console.log('Updated user');
      // })




  })


  module.exports = router;