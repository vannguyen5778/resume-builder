import { createSlice } from "@reduxjs/toolkit";
import { convertUnixtoDate } from "../utils/convertUnixToDate";
import { captureImage } from "../utils/downloadPDF";
import { emptyForm, defaultForm } from "./data";

const initialState = {
  resumes: [
    {
      id: new Date().getTime(),
      title: "",
      lastUpdate: convertUnixtoDate(Date.now()),
      imgUrl: "",
      data: defaultForm,
    },
  ],
  forms: defaultForm,
};

export const resumes = createSlice({
  name: "resumes",
  initialState,
  reducers: {
    setResumes(state, action) {
      state.resumes = action.payload;
    },

    removeResume(state, action) {
      state.resumes = state.resumes.filter(
        (obj) => obj.id !== action.payload.id
      );
    },
    setResume(state, action) {
      const resumeId = action.payload;
      const resume = state.resumes.find((resume) => resume.id == resumeId);
      state.forms = resume.data;
    },
    // updateImgUrl(state, action) {
    //   const id = action.payload;
    //   const index = resumes.findIndex((resume) => resume.id === id);

    //   if (index !== -1) {
    //     sta= {
    //       ...resumes[index],
    //       imgUrl: imageData,
    //     };

    //     // resumes.splice(index, 1, updatedResume);
    // }
    saveResume(state, action) {
      const resumeId = action.payload;
      const resume = state.resumes.find((resume) => resume.id == resumeId);
      resume.data = state.forms;
      // captureImage("canva").then((imageData) => {
      //   resume.imgUrl = imageData;
      //   console.log(imageData);
      // });
      resume.lastUpdate = convertUnixtoDate(Date.now());
    },

    clearResumes(state) {
      state.resumes = [];
    },

    addResume(state, action) {
      state.resumes.push({ ...action.payload, data: emptyForm});
      // console.log("addResume", { ...action.payload, data: emptyForm, imgUrl: "", lastUpdate: convertUnixtoDate(Date.now()) });
      state.forms = emptyForm;
    },
    setForms(state, action) {
      console.log("resume to set", action.payload);
      state.forms = action.payload;
    },
    deleteFormItem(state, action) {
      const [formId, subItemId] = action.payload;
      state.forms.forEach((form) => {
        if (Number(formId) === form.id) {
          form.subItems = form.subItems.filter(
            (subItem) => subItem.id !== Number(subItemId)
          );
        }
      });
    },
    addFormItem(state, action) {
      const formId = action.payload;
      state.forms.forEach((form) => {
        if (Number(formId) === form.id) {
          form.subItems.forEach((subItem) => ({
            ...subItem,
            isExpanded: false,
          }));
          form.subItems.push({
            id: new Date().getTime(),
            content: "Not specified",
            isExpanded: true,
          });
        }
        return form;
      });
    },

    setIsExpanded(state, action) {
      const [formId, subItemId] = action.payload;
      state.forms = state.forms.map((form) => {
        if (Number(formId) === form.id) {
          form.subItems = form.subItems.map((subItem) => {
            if (subItem.id === Number(subItemId)) {
              return { ...subItem, isExpanded: !subItem.isExpanded };
            } else {
              return { ...subItem, isExpanded: false };
            }
          });
        } else {
          form.subItems = form.subItems.map((subItem) => ({
            ...subItem,
            isExpanded: false,
          }));
        }
        return form;
      });
    },

    onDragExpand(state, action) {
      const [formId, subItemId, isExpandedState] = action.payload;
      const form = state.forms.find((form) => form.id === Number(formId));
      const subItem = form.subItems.find((subItem) => subItemId === subItem.id);
      subItem.isExpanded = isExpandedState;
    },

    handleInputChange(state, action) {
      const [formId, subItemId, name, value] = action.payload;
      const form = state.forms.find((form) => form.id === Number(formId));
      const subItem = form.subItems.find((subItem) => subItemId === subItem.id);
      subItem[name] = value;
    },

    handleKeyDown(state, action) {
      const [formId, subItemId, name] = action.payload;
      const form = state.forms.find((form) => form.id === Number(formId));
      const subItem = form.subItems.find((subItem) => subItemId === subItem.id);
      subItem[name].trim();

      if (subItem[name] !== "") {
        subItem[name] += "/n";
      }
    },

    loadExample(state) {
      state.forms = defaultForm;
    },

    clearResume(state) {
      state.forms = emptyForm;
    },
  },
});

export const {
  setResumes,
  removeResume,
  saveResume,
  clearResumes,
  addResume,
  setForms,
  deleteFormItem,
  addFormItem,
  setIsExpanded,
  handleInputChange,
  handleKeyDown,
  onDragExpand,
  loadExample,
  clearResume,
  setResume,
} = resumes.actions;

export default resumes.reducer;
