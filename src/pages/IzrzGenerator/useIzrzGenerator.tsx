import axios, { AxiosError } from "axios";
import { useCallback, useState } from "react";
import * as Yup from "yup";

const API_URL: string = import.meta.env.VITE_API_URL;

interface FormDataI {
  action_name: string;
  date: string;
  description: string;
  address: string;
  audience: string;
  izrz_title: string;
}

const initial_form_data: FormDataI = {
  action_name: "Prelekcja",
  date: new Date().toISOString().split("T")[0],
  description: "",
  address: "",
  audience: "Uczniowie kl. - \nOpiekunowie - ",
  izrz_title: ""
};

const useTaskFormik = () => {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const validationSchema = Yup.object({
    date: Yup.date()
      .required("Data jest wymagana")
      .min(new Date("1900.01.01"), "Data nie może być mniejsza niż 01.01.1900")
      .max(new Date("2050.10.10"), "Data nie może być większa niż 30.12.2050"),
    izrz_title: Yup.string().required("Tytuł zadania jest wymagany"),
    action_name: Yup.string().required("Nazwa działania jest wymagana"),
    address: Yup.string().required("Adres jest wymagany"),
    audience: Yup.string().required("Odbiorcy są wymagani"),
    description: Yup.string().required("Opis zadania jest wymagany")
  });

  const handlePostMiernikItem = useCallback(async (values: FormDataI) => {
    console.log("Posting data...");
    setLoading(true);
    try {
      const response = await axios.post<Blob>(`${API_URL}/api/generate_izrz`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        responseType: "blob"
      });

      // get file name from disposition header

      const file_name = `${values.izrz_title}_${values.date}_${values.action_name}_${values.address}`;

      // create url for blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // create link to download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${file_name || "output"}.docx`);
      document.body.appendChild(link);
      link.click();

      // clean up and remove the link
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url); // Free up memory

      console.log("Document downloaded successfully.");
    } catch (err) {
      const error = err as AxiosError;
      console.log(error);
      setError(`Error posting item: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  return { handlePostMiernikItem, validationSchema, initial_form_data, loading, error };
};

export default useTaskFormik;
