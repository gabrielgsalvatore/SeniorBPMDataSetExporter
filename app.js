"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const csv = __importStar(require("csv-stringify"));
const fs = __importStar(require("fs"));
const https = __importStar(require("https"));
// Function to make an HTTP GET request
function fetchData(url, token) {
    return new Promise((resolve, reject) => {
        https
            .get(url, { headers: { authorization: token } }, (res) => {
            let data = "";
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve(jsonData);
                }
                catch (error) {
                    reject(error);
                }
            });
        })
            .on("error", (error) => {
            reject(error);
        });
    });
}
// Function to convert JSON to CSV and save it to a file
function saveToCSV(data, filename) {
    csv.stringify(data, (err, output) => {
        if (err) {
            console.error("Error converting to CSV:", err);
            return;
        }
        fs.writeFile(filename, output, (err) => {
            if (err) {
                console.error("Error saving CSV file:", err);
                return;
            }
            console.log("CSV file saved successfully!");
        });
    });
}
// URL of the API
const apiUrl = "https://platform.senior.com.br/t/senior.com.br/bridge/1.0/odata/platform/ecm_form/enum_acidente_transito";
const token = "4OLmLBErnI9bZtQVKoebrvbxCr0bVTxT";
// Main function
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Fetch data from the API
            const jsonData = yield fetchData(apiUrl, token);
            // Transform JSON data to an array of arrays (rows)
            const csvData = jsonData.map((item) => {
                return [item.userId, item.id, item.title, item.body];
            });
            // Add headers to CSV
            csvData.unshift(["User ID", "ID", "Title", "Body"]);
            // Save CSV data to a file
            saveToCSV(csvData, "data.csv");
        }
        catch (error) {
            console.error("Error fetching or processing data:", error);
        }
    });
}
// Run the main function
main();
