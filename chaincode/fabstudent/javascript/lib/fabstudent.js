
'use strict';
const { createHash } = require('crypto');
const { Contract } = require('fabric-contract-api');

class FabStudent extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const students =[
            {
                name: 'Yash',
                rollNo: '1',
                marks: "69",
                stream: 'EE',
                year: '2024',
            },
            {
                name: 'Akshat',
                rollNo: '2',
                marks: "87",
                stream: 'EE',
                year: '2023',
            },
            {
                name: 'Rohan',
                rollNo: '3',
                marks: "98",
                stream: 'CSE',
                year: '2024',
            },
            {
                name: 'Adi',
                rollNo: '4',
                marks: "89",
                stream: 'CSE',
                year: '2023',
            },
            {
                name: 'Arnav',
                rollNo: '5',
                marks: "100",
                stream: 'CSE',
                year: '2024',
            },
        ];
        for(let i = 0 ; i<students.length ; i++)
        {
            await ctx.stub.putState(students[i].rollNo, Buffer.from(JSON.stringify({name:students[i].name,
            marks: students[i].marks,
            stream: students[i].stream,
            year: students[i].year,
            hash: createHash('sha256').update(students[i].name+students[i].marks+students[i].stream+students[i].year+students[i].rollNo).digest('hex')})));
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async addStudent(ctx , name ,  marks , stream , year , rollNo)      // invoke
    {
        console.info('============= START : Adding Student ===========');
        let student =
            {
                name: name,
                marks : marks,
                stream: stream,
                year: year,
                hash: createHash('sha256').update(name+marks+stream+year+rollNo).digest('hex'),
            };
        await ctx.stub.putState(rollNo, Buffer.from(JSON.stringify(student))); 
        console.info('============= END : Student Added ===========');
    }

    async getStudentByRollNo(ctx, rollNo) {                                      // query 
        // const studentAsBytes = await ctx.stub.getState(keyDid); // get the student from chaincode state
        // if (!studentAsBytes || studentAsBytes.length === 0) {
        //     throw new Error(`${keyDid} does not exist`);
        // }
        // console.log(studentAsBytes.toString());
        // return studentAsBytes.toString();
      
        console.info('getting history for rollNo: ' + rollNo);
        let iterator = await ctx.stub.getHistoryForKey(rollNo);
        let result = [];
        let res = await iterator.next();
        while (!res.done) {
          if (res.value) {
            console.info(`found state update with value: ${res.value.value.toString('utf8')}`);
            let jsonRes={}
            jsonRes.Key = res.value.key;
            jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
            jsonRes.TxId = res.value.tx_id;
            jsonRes.Timestamp = res.value.timestamp;
            result.push(jsonRes);
          }
          res = await iterator.next();
        }
        await iterator.close();
        return result;
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
            allResults.push({ Key: key, Value: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async getStudentHash(ctx , rollNo)
    {
        const studentAsBytes = await ctx.stub.getState(rollNo);
        if (!studentAsBytes || studentAsBytes.length === 0) {
                throw new Error(`Student with RollNo: ${rollNo} does not exist`);
            }
            const student = JSON.parse(studentAsBytes.toString());
            return student.hash;
    }

    // async changeStudentMarks(ctx, keyDid, newMarks) {                       // invoke
    //     console.info('============= START : changeStudentMarks ===========');

    //     const studentAsBytes = await ctx.stub.getState(keyDid); // get the car from chaincode state
    //     if (!studentAsBytes || studentAsBytes.length === 0) {
    //         throw new Error(`${keyDid} does not exist`);
    //     }
    //     const student = JSON.parse(studentAsBytes.toString());
    //     student.marks = newMarks;

    //     await ctx.stub.putState(keyDid, Buffer.from(JSON.stringify(student)));
    //     console.info('============= END : changeStudentMarks ===========');
    // }

    // async getStudentByYear(ctx, year){
    //     let queryString ={};
    //     queryString.selector={};
    //     queryString.selector.year = year;
    //     console.info("year is:"+ JSON.stringify(queryString));
    //     let iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString))
    //     let result = [];
    //     let res = await iterator.next();
    //     while (!res.done) {
    //       if (res.value) {
    //         console.info(`found state update with value: ${res.value.value.toString('utf8')}`);
    //         let jsonRes = {}
    //         jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
    //         jsonRes.Key = res.value.key
    //         result.push(jsonRes);
    //       }
    //       res = await iterator.next();
    //     }
    //     await iterator.close();
    //     return result;
    // }

    // async getStudentByStream(ctx, stream){
    //     let queryString ={}
    //     queryString.selector = {"stream": stream}
    //     let iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString))
    //     let result = [];
    //     let res = await iterator.next();
    //     while (!res.done) {
    //       if (res.value) {
    //         console.info(`found state update with value: ${res.value.value.toString('utf8')}`);
    //         let jsonRes = {}
    //         jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
    //         jsonRes.Key = res.value.key
    //         result.push(jsonRes);
    //       }
    //       res = await iterator.next();
    //     }
    //     await iterator.close();
    //     return result;
    //  }

    // async getAllResults(iterator, isHistory) {
    //     let allResults = [];
    //     while (true) {
    //       let res = await iterator.next();
    
    //       if (res.value && res.value.value.toString()) {
    //         let jsonRes = {};
    //         console.log(res.value.value.toString('utf8'));
    
    //         if (isHistory && isHistory === true) {
    //           jsonRes.TxId = res.value.tx_id;
    //           jsonRes.Timestamp = res.value.timestamp;
    //           jsonRes.IsDelete = res.value.is_delete.toString();
    //           try {
    //             jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
    //           } catch (err) {
    //             console.log(err);
    //             jsonRes.Value = res.value.value.toString('utf8');
    //           }
    //         } else {
    //           jsonRes.Key = res.value.key;
    //           try {
    //             jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
    //           } catch (err) {
    //             console.log(err);
    //             jsonRes.Record = res.value.value.toString('utf8');
    //           }
    //         }
    //         allResults.push(jsonRes);
    //       }
    //       if (res.done) {
    //         console.log('end of data');
    //         await iterator.close();
    //         console.info(allResults);
    //         return allResults;
    //       }
    //     }
    //   }
}
module.exports = FabStudent;
