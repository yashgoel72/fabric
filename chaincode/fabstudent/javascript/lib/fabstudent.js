/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FabStudent extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        // let student =
        //     {
        //         name: 'Yash',
        //         rollNo: '0',
        //         marks: "69",
        //         stream: 'Electrical',
        //         year: '2024',
        //     };
        // let keyDid = "0";
        // await ctx.stub.putState(keyDid, Buffer.from(JSON.stringify(student)));
        const students =[
            {
                did : "1",
                name: 'Yash',
                rollNo: '29',
                marks: "69",
                stream: 'EE',
                year: '2024',
            },
            {
                did : "2",
                name: 'Akshat',
                rollNo: '37',
                marks: "87",
                stream: 'EE',
                year: '2023',
            },
            {
                did :"3",
                name: 'Rohan',
                rollNo: '12',
                marks: "98",
                stream: 'CSE',
                year: '2024',
            },
            {
                did :"4",
                name: 'Adi',
                rollNo: '1',
                marks: "89",
                stream: 'CSE',
                year: '2023',
            },
            {
                did :"5",
                name: 'Arnav',
                rollNo: '56',
                marks: "100",
                stream: 'CSE',
                year: '2024',
            },
        ];
        for(let i = 0 ; i<students.length ; i++)
        {
            await ctx.stub.putState(students[i].did, Buffer.from(JSON.stringify({name:students[i].name,
            rollNo: students[i].rollNo,
            marks: students[i].marks,
            stream: students[i].stream,
            year: students[i].year})));
        }
        console.info('============= END : Initialize Ledger ===========');
    }
 
    async addStudent(ctx , keyDid , name , rollNo , marks , stream , year)      // invoke
    {
        console.info('============= START : Adding Student ===========');
        let student =
            {
                name: name,
                rollNo: rollNo,
                marks : marks,
                stream: stream,
                year: year,
            };
        await ctx.stub.putState(keyDid, Buffer.from(JSON.stringify(student))); 
        console.info('============= END : Student Added ===========');
    }

    async getStudentByDid(ctx, keyDid) {                                      // query 
        const studentAsBytes = await ctx.stub.getState(keyDid); // get the student from chaincode state
        if (!studentAsBytes || studentAsBytes.length === 0) {
            throw new Error(`${keyDid} does not exist`);
        }
        console.log(studentAsBytes.toString());
        return studentAsBytes.toString();
    }

    async getAllStudents(ctx) {                                             //query
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async changeStudentMarks(ctx, keyDid, newMarks) {                       // invoke
        console.info('============= START : changeStudentMarks ===========');

        const studentAsBytes = await ctx.stub.getState(keyDid); // get the car from chaincode state
        if (!studentAsBytes || studentAsBytes.length === 0) {
            throw new Error(`${keyDid} does not exist`);
        }
        const student = JSON.parse(studentAsBytes.toString());
        student.marks = newMarks;

        await ctx.stub.putState(keyDid, Buffer.from(JSON.stringify(student)));
        console.info('============= END : changeStudentMarks ===========');
    }

    async getStudentByYear(ctx, year){
        let queryString ={};
        queryString.selector={};
        queryString.selector.year = year;
        let iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString))
        let result = this.getAllResults(iterator,false)
        return JSON.stringify(result)
    }

    async getStudentByStream(ctx, stream){
        let queryString ={}
        queryString.selector = {"stream": stream}
        let iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString))
        let result = this.getAllResults(iterator,false)
        return JSON.stringify(result)
    }

    async getAllResults(iterator, isHistory) {
        let allResults = [];
        while (true) {
          let res = await iterator.next();
    
          if (res.value && res.value.value.toString()) {
            let jsonRes = {};
            console.log(res.value.value.toString('utf8'));
    
            if (isHistory && isHistory === true) {
              jsonRes.TxId = res.value.tx_id;
              jsonRes.Timestamp = res.value.timestamp;
              jsonRes.IsDelete = res.value.is_delete.toString();
              try {
                jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
              } catch (err) {
                console.log(err);
                jsonRes.Value = res.value.value.toString('utf8');
              }
            } else {
              jsonRes.Key = res.value.key;
              try {
                jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
              } catch (err) {
                console.log(err);
                jsonRes.Record = res.value.value.toString('utf8');
              }
            }
            allResults.push(jsonRes);
          }
          if (res.done) {
            console.log('end of data');
            await iterator.close();
            console.info(allResults);
            return allResults;
          }
        }
      }
}
module.exports = FabStudent;
