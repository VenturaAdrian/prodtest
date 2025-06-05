var express = require('express');
var bcrypt = require('bcrypt');
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
    
    const Requests = db.define('requests_master',{
        request_id:{
            type:DataTypes.INTEGER,
            primaryKeys: true
        },
        comm_Area:{
            type:DataTypes.STRING,          
        },
        comm_Act:{
            type: DataTypes.STRING,
        },
        date_Time:{
            type: DataTypes.STRING,
        },
        comm_Venue:{ 
            type:DataTypes.STRING,
        },
        comm_Guest:{
            type:DataTypes.STRING,
        },
        comm_Docs:{
            type:DataTypes.STRING,
        },
        comm_Emps:{
            type:DataTypes.STRING,
        },
        comm_Benef:{
            type:DataTypes.STRING,
        }
    },{
        freezeTableName: false,
        timestamps: false,
        createdAt: false,
        updatedAt: false,
        tableName: 'request_master'
    })

    router.get('/history', async(req,res,next)=>{
        console.log('/history mw was called')
        try{
            const data = await knex('request_master').select('*'); 
            res.json(data)
            console.log(data)
        }catch(err){
            console.error('ERROR FETCHING:', err);
                res.status(500).json({error: 'Failed fetch data'})
            }
         

    })

    router.post('/add-request-form',async (req,res,next) => {

        const currentTimestamp = new Date(); //Current time - YYYY/MM/DD - 00/HH/MM/SSS

       console.log(req)
       try{
       const{
        comm_Area,
        comm_Act,
        date_Time,
        comm_Venue,
        comm_Guest,
        comm_Docs,
        comm_Emps,
        comm_Benef,
        created_by
       } = req.body;

       
        await knex('request_master').insert({
            request_status: 'request',
            comm_Area: comm_Area,
            comm_Act: comm_Act,
            date_Time: date_Time,
            comm_Venue: comm_Venue,
            comm_Guest: comm_Guest,
            comm_Docs: comm_Docs,
            comm_Emps: comm_Emps,
            comm_Benef: comm_Benef,
            created_by: created_by,
            created_at: currentTimestamp,
            updated_by:'',
            updated_at: currentTimestamp,
        
        })
        res.status(200).json({ message: 'Request added successfully' });
       }catch (err) {
    console.error('Error in backend:', err); // print full error
    res.status(500).json({ message: 'Server error', error: err.message });
}


    })
module.exports = router;