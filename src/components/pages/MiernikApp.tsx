import axios from "axios";
import { useEffect, useState } from "react";
// import { Form } from "react-router-dom";
import { Box, Button as MUIButton, MenuItem, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import moment from "moment";

interface ProgramNameI {
  _id: string;
  name: string;
}

const API_URL = import.meta.env.VITE_API_URL;

const MiernikApp = () => {
  const [formData, setFormData] = useState<{
    name: string;
    date: string;
    program: {
      name: string;
      id: string;
    };
    people_count: number;
    action_count: number;
  }>({
    name: "",
    date: "",
    program: {
      name: "",
      id: ""
    },
    people_count: 0,
    action_count: 0
  });

  const [errors, setErrors] = useState<{
    name: string;
    date: string;
    program_name: string;
    people_count: string;
    action_count: string;
  }>({
    name: "",
    date: "",
    program_name: "",
    people_count: "",
    action_count: ""
  });

  const [program_names, setProgramNames] = useState<ProgramNameI[]>([]);

  const fetchProgramNames = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/program_names`, {
        withCredentials: true
      });

      console.log(response);

      if (response.status === 200) {
        const { data } = response.data as { data: ProgramNameI[] };

        if (data.length > 0) {
          setProgramNames(data);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProgramNames();
  }, []);

  const SelectProgramNames = () => {
    return (
      <TextField
        select
        label="Nazwa programu"
        value={formData.program.id}
        onChange={(e) => {
          const program_id = e.target.value;
          const program = program_names.find((program) => program._id === program_id);

          // **here program was found, so no undefined returned from .find()
          if (program) {
            setFormData({ ...formData, program: { name: program.name, id: program._id } });
          }
        }}
        variant="filled"
        required
      >
        {program_names.map((program_name, index) => (
          <MenuItem key={index} value={program_name._id}>
            {program_name.name}
          </MenuItem>
        ))}
      </TextField>
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = moment(new Date(e.target.value)).format("YYYY-MM-DD");
    setFormData({ ...formData, [e.target.name]: newDate });
    console.log(newDate); // value picked from date picker
  };

  const handlePostMiernikItem = async () => {
    const validateForm = () => {
      let valid = true;
      const newErrors = {
        name: "",
        date: "",
        program_type: "",
        program_name: "",
        people_count: "",
        action_count: ""
      };

      if (!formData.name) {
        newErrors.name = "Nazwa programu nie może być pusta";
        valid = false;
      }

      if (!formData.date) {
        newErrors.date = "Data nie może być pusta";
        valid = false;
      }

      if (!formData.program.name) {
        newErrors.program_name = "Wybierz nazwę programu";
        valid = false;
      }

      if (formData.people_count <= 0) {
        newErrors.people_count = "Liczba osób musi być większa od 0";
        valid = false;
      }

      if (formData.action_count <= 0) {
        newErrors.action_count = "Liczba działań musi być większa od 0";
        valid = false;
      }

      setErrors(newErrors);
      return valid;
    };

    const is_valid = validateForm();

    if (is_valid) {
      console.log("Formularz jest poprawny:", formData);
    } else {
      console.log("Formularz zawiera błędy:", errors);
    }

    const new_miernik_item = {
      ...formData
      // TODO: owner will be get from httponly cookie
    };

    try {
      const response = await axios.post(
        `${API_URL}/api/program_item`,
        {
          new_miernik_item
        },
        {
          withCredentials: true
        }
      );
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box p={4}>
      <Grid
        sx={{
          backgroundColor: "white",
          p: 2,
          boxShadow: 2,
          "&>*>*": {
            boxSizing: "border-box",
            p: 1.1,
            width: `100%`
          },
          rowGap: 1,
          borderRadius: `10px`
        }}
        container
      >
        <Grid size={6}>
          <TextField label="Nazwa" required variant="filled" name="name" value={formData.name} onChange={handleChange} />
        </Grid>

        <Grid size={6}>
          <TextField variant="filled" required type="date" name="date" value={formData.date} onChange={handleDateChange} />
        </Grid>

        <Grid size={6}>{program_names.length > 0 && <SelectProgramNames />}</Grid>

        <Grid size={6}>
          <TextField label="Liczba działań" required variant="filled" type="number" name="action_count" value={formData.action_count} onChange={handleChange} />
        </Grid>

        <Grid size={6}>
          <TextField label="Liczba osób" required variant="filled" type="number" name="people_count" value={formData.people_count} onChange={handleChange} />
        </Grid>

        <Box sx={{ width: "100%", display: "flex", p: 1, alignItems: "center" }}>
          <MUIButton sx={{ maxWidth: `150px` }} variant="contained" color="primary" onClick={handlePostMiernikItem}>
            Dodaj
          </MUIButton>
        </Box>
      </Grid>
    </Box>
  );
};

export default MiernikApp;
