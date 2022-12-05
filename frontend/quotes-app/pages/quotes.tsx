import { GetServerSideProps, NextPage } from 'next'
import styles from '../styles/Home.module.css'
import { Column, Quote } from '../types';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material';
import { useState } from 'react';
import Link from 'next/link';
import ManIcon from '@mui/icons-material/Man';
import WomanIcon from '@mui/icons-material/Woman';
import { useRouter } from 'next/router';

const Quotes: NextPage<{quotes: Quote[]}> = ({quotes}) => { 
  const columns: readonly Column[] = [
    { id: 'id', label: 'ID', minWidth: 170 },
    { id: 'author_name', label: 'AuthorName', minWidth: 100 },
    { id: 'quote_text', label: 'QuoteText', minWidth: 250},
    { id: 'gender', label: 'Gender', minWidth: 50},
  ];
  
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const router = useRouter()
  
    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    const GenerateNewQuotesOnServer = async () => {
      const request = await fetch('http://localhost:4000/api/quotes/generate')
      const res = await request.json().then(e=>{
        if(e.message==="Successfully updated quotes."){
          alert("Quotes are refreshed, if there were new quotes they are added.")
          router.reload();
        }
      }).catch(err=>alert("There was an error please try again later. Error: " + err))
    }

    const handleGenerateNewQuotesOnServer = () => {
        GenerateNewQuotesOnServer()
    }
  return (
    <div className={styles.container}>      
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {quotes
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((quote) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={quote._id}>
                    <TableCell>
                      {quote._id}
                    </TableCell>
                    <TableCell>
                      {quote.author_name}
                    </TableCell>
                    <TableCell>
                      {quote.quote_text}
                    </TableCell>
                    <TableCell>
                      {quote.gender!=="?"
                      ?
                        quote.gender==="male"
                        ?
                        <ManIcon></ManIcon>
                        :
                        <WomanIcon></WomanIcon>
                      :
                      "?"
                      }
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={quotes.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
    <Link href={"/random-quote"} passHref><button>Get a random quote</button></Link>
    <button onClick={handleGenerateNewQuotesOnServer}>Generate new quotes on server</button>
    </div>
  );
};

export const getServerSideProps : GetServerSideProps = async (context) => {
    function removeDuplicates(arr: string[]) {
      return arr.filter((item,
          index) => arr.indexOf(item) === index);
    }

    const res = await fetch("http://localhost:4000/api/quotes/");
    const result: Quote[]  = await res.json()
    //we get all the first names from the data and remove the duplicates
    //also we add name[]= for makking the request later with multiple query params (up to 10 for free on genderize)
    //this is to make the proccess faster and dont make any unecessery api calls and reduce time
    const genderNameParams: string[] = removeDuplicates(result.map(e=>`name[]=${e.author_name.split(' ').filter(Boolean)[0]}`))
    const urlsForFetching: string[] = []
    let baseUrl = 'https://api.genderize.io/?'
    for(let i = 1; i<genderNameParams.length+1; i++){
      baseUrl+="&"+genderNameParams[i-1]
      if(i%10===0 || i===genderNameParams.length){
        urlsForFetching.push(baseUrl)
        baseUrl = 'https://api.genderize.io/?'
        continue
      }
    }

    //after we finish creating the urls we need to fetch for each of the url and store the names in array of objects with name and gender.
    //if the probability of the gender is greater or equal to 0.60 then we assume its that gender otherwise we leave '?' symbol
    const gendersFromApi: {gender: string, name: string}[] = []
    for (const url of urlsForFetching) {
        const response = await fetch(url)
        const genders: {count: number, gender: string, name: string, probability: number}[]  = await response.json()

        genders.forEach(gender => {
            if(gender.probability>=0.60){
              gendersFromApi.push({name:gender.name, gender: gender.gender})
            }else{
              gendersFromApi.push({name:gender.name, gender: "?"})
            }
        });
    }

    //after we have all the genders for the names, we need to append them on the array with quotes
    for (const gender of gendersFromApi) {
      result.filter(e=>e.author_name.split(' ').filter(Boolean)[0].toLowerCase()===gender.name.toLowerCase()).forEach(e=>{
        e.gender=gender.gender;
      })
    }
    return {
      props: {
        quotes: result,
      }
    }
}

export default Quotes;