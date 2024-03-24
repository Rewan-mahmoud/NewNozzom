import * as React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Button, FormHelperText } from '@mui/material';
import { DateField } from '@mui/x-date-pickers';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import useToken from '../../hooks/useToken';
import { useEffect } from 'react';
import { useState } from 'react';
import { apiUrl } from '../../features/table/billSlice';
import { useFormik } from "formik";
import  * as Yup  from "yup";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";


export default function PaymentForm() {
  const {id} = useParams()

  const formik = useFormik({
    initialValues: {
      type: "creditcard",
      name: "",
      number: "",
      cvc: "",
      month: "",
      year: "",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Required"),
      number: Yup.string().required("Required"),
      cvc: Yup.string().required("Required"),
      month: Yup.string().required("Required"),
      year: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));

      var session_url = "https://api.moyasar.com/v1/payments";
      var basicAuth =
        "Basic " + btoa("pk_test_XYCTJeE7iJKxhML4BeuXRjb4Ep66aGUo2Dtb5n8G");
      axios
        .post(
          session_url,
          {
            source: values,
            amount: parseInt(modalValue) * 100,
            currency: "SAR",
            callback_url:
              "https://einvoices-git-frontend-ahmedsameh74.vercel.app/",
          },
          {
            headers: { Authorization: basicAuth },
          }
        )
        .then(function (response) {
          console.log("Authenticated");
          toast.success("Succeful payment!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          // toast('suceess')
        })
        .catch(function (error) {
          Object.keys(error.response.data.errors).map((item) =>
            error.response.data.errors[item].map((ele) => {
              toast.error(ele, {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });
            })
          );
        });
    },
  });
  
  // const [state, setState] = React.useState({
  //   type: 'creditcard',
  //   name: '',
  //   number: '',
  //   cvc: '',
  //   month: '',
  //   year: ''
  // })
  const [loading, setLoading] = useState(false);
  const { token } = useToken();
  // const { id } = useParams();
  const [modalValue, setModalValue] = useState(null);
  const [company, setCompany] = useState(null);
  const fetchPrev = async () => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    axios
      .post(`${apiUrl}show_company`, {}, { headers })
      .then((res) => setCompany({ ...res.data.data }));
    axios
      .post(`${apiUrl}show_sale_invoice_notoken`, { id })
      .then((res) => {
        setLoading(false);
        setModalValue(res.data.data[0].total);
        console.log(res.data.data[0]);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    setLoading(true)
    fetchPrev()
  }, [])

  console.log(formik.errors.number, formik.touched.number)

  
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              required
              id="cardName"
              label="Name on card"
              fullWidth
              autoComplete="cc-name"
              variant="standard"
              name="name"
              error={formik.errors.name}
              onChange={formik.handleChange}
            />
            {formik.errors.name  && (
              <FormHelperText id="component-error-text">
                {formik.errors.name}
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              id="cardNumber"
              label="Card number"
              fullWidth
              autoComplete="cc-number"
              variant="standard"
              name="number"
              error={formik.errors.number }
              onChange={formik.handleChange}
            />
            {formik.errors.number  && (
              <FormHelperText id="component-error-text">
                {formik.errors.number}
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <DateField
              label="Expiry date"
              autoComplete="cc-exp"
              fullWidth
              required
              format="mm-YY"
              onChange={(e) => {
                console.log(e);
                formik.setFieldValue("year", `${e.$y}`);
                formik.setFieldValue("month", `${e.$m}`);
              }}
            />
            {(formik.errors.month || formik.errors.year) && (
              <FormHelperText id="component-error-text">
                {formik.errors.month || formik.errors.year}
              </FormHelperText>
            )}
            {/* <TextField
            required
            id="expDate"
            label="Expiry date"
            fullWidth
            autoComplete="cc-exp"
            variant="standard"
            onChange={(e) =>
              setState((prev) => ({ ...prev, year: e.target.value }))
            }
          /> */}
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              required
              error={formik.errors.cvc}
              id="cvc"
              label="CVC"
              helperText="Last three digits on signature strip"
              fullWidth
              autoComplete="cc-csc"
              variant="standard"
              name="cvc"
              onChange={formik.handleChange}
            />
            {formik.errors.cvc  && (
              <FormHelperText id="component-error-text">
                {formik.errors.cvc}
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={12}>
            {/* <FormControlLabel
            control={<Checkbox color="secondary" name="saveCard" value="yes" />}
            sx={{ "& .MuiSvgIcon-root": {
              position: 'unset'
            } }}
            label="Remember credit card details for next time"
          /> */}
            <Button
              onSubmit={formik.handleSubmit}
              // disabled={formik.isSubmitting}
              type="submit"
            >
              Submit
            </Button>
          </Grid>
        </Grid>
        <ToastContainer />
      </form>
    </React.Fragment>
  );
}
