import fs from 'fs';
import {join} from 'path';

const readFile = fs.readFileSync(join(__dirname,'../data/cadastro.csv'));

const stringData = readFile.toString();

const createToken = (tokenLength: number): string => {
    let newToken;
    const listOfChars: string = `abcdefghijklmnopqrstuvwxyz0123456789`;
    return newToken;
};

const transformData = (data:string) => {
    const splittedLines = data.split('\n');
    const newData = splittedLines.map( item => {
        if(splittedLines.indexOf(item) !== 0){
            let newItem:string[] =  item.split(',');
            return newItem;
        } 
    })
    return newData;
};

const mappedNewData = (newData:string[]) => {
    const data = newData.map(item => {        
        let data = item[2].split('/');
            let dia = data[1];
            let mes = data[0];
            let ano = data[2];
            const mappedItem =  {
                'data_registro': new Date(item[0]),
                'nome': String(item[1]),
                'data_nascimento':new Date(`${mes}/${dia}/${ano}`),
                'rg': item[3],
                'cpf': item[4],
                'telefone': item[5],
                'e-mail': item[6],
                'logradouro': item[7],
                'cidade': item[8],
                'numero': item[9],
                'complemento': item[10],
                'bairro': item[11],
                'cep': item[12]
            }

           return mappedItem;
        
    })
    return data;
};

const Main = async() => {
    const newData = await transformData(stringData);
    //@ts-ignore
    const data = mappedNewData(newData);
    return data;
};
//@ts-ignore

Main().then(res => console.log(res))