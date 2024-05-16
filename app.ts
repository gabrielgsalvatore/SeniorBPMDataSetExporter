import * as csv from "csv-stringify";
import * as fs from "fs";
import * as https from "https";
import * as readline from "readline";
import { BEARER_TOKEN } from "./environment";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to make an HTTP GET request
function fetchData(
  url: string,
  token: string,
  dataSourceName: string
): Promise<any> {
  return new Promise((resolve, reject) => {
    const req = https
      .request(
        url,
        {
          method: "POST",
          headers: {
            authorization: `bearer ${token}`,
            "content-type": "application/json;charset=UTF-8",
          },
        },
        (res) => {
          let data = "";

          res.on("data", (chunk) => {
            data += chunk;
          });

          res.on("end", () => {
            try {
              const jsonData = JSON.parse(data);
              resolve(jsonData);
            } catch (error) {
              reject(error);
            }
          });
        }
      )
      .on("error", (error) => {
        reject(error);
      });
    req.write(
      JSON.stringify({
        dataSource: dataSourceName,
        token: token,
        skip: 0,
        top: 999,
      })
    );
    req.end();
  });
}

// Function to convert JSON to CSV and save it to a file
function saveToCSV(data: any[], filename: string) {
  csv.stringify(data, (err, output) => {
    if (err) {
      console.error("Error converting to CSV:", err);
      return;
    }
    fs.mkdirSync(".\\exported", { recursive: true });
    fs.writeFile(`.\\exported\\${filename}`, output, (err) => {
      if (err) {
        console.error("Error saving CSV file:", err);
        return;
      }
      console.log(`CSV file ${filename} saved successfully!`);
    });
  });
}

// URL of the API
let apiUrl =
  "https://platform.senior.com.br/t/senior.com.br/bridge/1.0/rest/platform/ecm_form/actions/getResultSet";

// Function to create readline interface
function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });
}

function askQuestion(query: string): Promise<string> {
  const rl = createInterface();
  return new Promise((resolve, reject) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Main function
async function main() {
  try {
    let token = BEARER_TOKEN;
    if (!token) {
      token = await askQuestion(
        "Token não localizado no arquivo environment.ts, digite o Bearer Token sem o Bearer: "
      );
    } else {
      console.log("Utilizando token padrão definido no environment.ts");
    }
    const dataSetName = await askQuestion("Insira o nome da Fonte de Dados: ");
    let fileName = dataSetName + ".csv";

    const jsonData = await fetchData(apiUrl, token, dataSetName);
    const jsonArray = JSON.parse(jsonData.data).value;

    const csvData = jsonArray.map((item: any) => {
      delete item["id"];
      let arrayToReturn = [];
      for (const value in Object.values(item)) {
        arrayToReturn.push(Object.values(item)[value]);
      }
      return arrayToReturn;
    });
    const headers = [];
    for (const key in Object.keys(jsonArray[0])) {
      headers.push(Object.keys(jsonArray[0])[key]);
    }
    // Add headers to CSV
    csvData.unshift(headers);
    saveToCSV(csvData, fileName);
  } catch (error) {
    console.error("Erro!", error);
  }
}

// Run the main function
main();
