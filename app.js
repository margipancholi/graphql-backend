const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");

const Employee = require("./models/employee");

const app = express();
app.use(bodyParser.json());

const employees = [];

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type",
    "Authorization"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  // res.setHeader("Access-Control-Allow-Credentials", true);
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  // Pass to next layer of middleware
  next();
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
        type Employee {
            _id:ID!
            firstName:String!
            lastName:String!
            dateOfBirth:String!
            dateOfJoining:String!
            designation:String!
            department:String!
            employeeType:String!
            currentStatus:String!
        }
        
        input EmployeeInput {
            firstName:String!
            lastName:String!
            dateOfBirth:String!
            dateOfJoining:String!
            designation:String!
            department:String!
            employeeType:String!
            currentStatus:String!
        }

        type RootQuery {
          employees:[Employee!]!
          singleEmployee(id:ID!):Employee!
          filterByName(name:String!):[Employee!]!
      }

      type RootMutation{
          createEmployee(employeeInput:EmployeeInput): Employee
          updateEmployee(id:ID!,employeeInput:EmployeeInput):Employee
          deleteEmployee(id:ID!):Employee
      }
        schema {
            query:RootQuery
            mutation:RootMutation
        }
        `),
    rootValue: {
      employees: () => {
        return Employee.find()
          .then((employees) =>
            employees.map((employee) => {
              return { ...employee._doc };
            })
          )
          .catch((error) => console.log(error));
      },
      singleEmployee: (args) => {
        return Employee.findById(args.id);
      },
      deleteEmployee: (args) => {
        return Employee.deleteOne({ _id: args.id });
      },
      filterByName: (args) => {
        return Employee.find({ firstName: args.name }).exec();
      },
      createEmployee: (args) => {
        const employee = new Employee({
          firstName: args.employeeInput.firstName,
          lastName: args.employeeInput.lastName,
          dateOfBirth:new Date(args.employeeInput.dateOfBirth).toISOString(),
          dateOfJoining: new Date(args.employeeInput.dateOfJoining).toISOString(),
          designation: args.employeeInput.designation,
          department: args.employeeInput.department,
          employeeType: args.employeeInput.employeeType,
          currentStatus: args.employeeInput.currentStatus,
        });
        employee
          .save()
          .then((result) => {
            console.log(result);
            return {
              ...result._doc,
            };
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
        // console.log(employee);
        // employees.push(employee);
        // return employee;
      },
    },
    graphiql: true,
  })
);

mongoose
  .connect(
    // "mongodb+srv://margi:Margi@12@cluster0.wem8d.mongodb.net/employeesDatabase?retryWrites=true&w=majority"
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DB_ADDRESS}/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen({ port: 4000 }, () =>
      console.log(`🚀 Server ready at http://localhost:4000/`)
    );
  })
  .catch((err) => {
    console.log(err);
  });
