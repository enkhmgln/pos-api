import axios from "axios";

export const baseAxios = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});
