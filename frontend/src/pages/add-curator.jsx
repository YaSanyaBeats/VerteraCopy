import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Row, Col, Dropdown, DropdownButton } from "react-bootstrap";

import {
  COUNTRY_LIST,
  DEPARTMENTS_LIST,
  JOB_TITLE_LIST,
  HELPER_PERMS,
} from "../apollo/queries";
import { ADD_HELPER_USER } from "../apollo/mutations";

import { DatePicker } from "rsuite";
import { MultiSelect } from "primereact/multiselect";
import Loader from "../pages/loading";
import ButtonCustom from "../components/button";
import BackTitle from "../components/back-title";
import ModalDialog from "../components/modal-dialog";
import NotFoundPage from "./not-found-page";

import "../css/add-curator.css";

import get_translation from "../helpers/translation";

function AddCurator() {
  const [departmentList, setDepartmentList] = useState([]);
  const [jobTitleList, setJobTitleList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedDepartmentsId, setSelectedDepartmentsId] = useState([]);
  const [selectedJobTitle, setSelectedJobTitle] = useState(null);
  const [selectedJobTitleId, setSelectedJobTitleId] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const location = useLocation();
  const [linkPrev, setLinkPrev] = useState(null);

  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const [queryError, setQueryError] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [nameValue, setNameValue] = useState("");
  const [surnameValue, setSurnameValue] = useState("");
  const [patronymicValue, setPatronymicValue] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [loginValue, setLoginValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [language] = useState(localStorage.getItem("language"));

  if (user === null) {
    window.location.href = "/";
  }

  const { data: dataPerms } = useQuery(HELPER_PERMS, {
    variables: {
      token: user?.token,
      id: user?.id,
    },
  });

  const isAdmin = () => {
    return (
      user.role === "system" || dataPerms.helperQuery.helperPerms.helperEdit
    );
  };

  const { loading, error, data } = useQuery(DEPARTMENTS_LIST, {
    variables: {
      token: user.token,
      lang: language,
    },
  });

  const {
    loading: loadingCountryList,
    error: errorCountryList,
    data: dataCountryList,
  } = useQuery(COUNTRY_LIST, {
    variables: {
      token: user.token,
      lang: language,
    },
  });

  const {
    loading: loadingJobTitleList,
    error: errorJobTitleList,
    data: dataJobTitle,
  } = useQuery(JOB_TITLE_LIST, {
    variables: {
      token: user.token,
      lang: language,
    },
  });

  const navigate = useNavigate();

  const goToAllCurators = () => {
    navigate("/curators");
  };

  useEffect(() => {
    if (data && data.helperQuery.departmentList) {
      setDepartmentList(data.helperQuery.departmentList);
    }

    if (dataJobTitle && dataJobTitle.helperQuery.jobTitleList) {
      setJobTitleList(dataJobTitle.helperQuery.jobTitleList);
    }

    if (dataCountryList && dataCountryList.clientQuery.countryList) {
      setCountryList(dataCountryList.clientQuery.countryList);
    }

    setLinkPrev("/curators");
  }, [data, dataJobTitle, dataCountryList, location.state]);

  const [addHelperUser] = useMutation(ADD_HELPER_USER);

  if (loading || loadingCountryList || loadingJobTitleList) {
    return <Loader />;
  }

  if (error || errorCountryList || errorJobTitleList) {
    const networkError =
      error.networkError ??
      errorCountryList.networkError ??
      errorJobTitleList.networkError;

    if (networkError) {
      // console.log("Network Error:", networkError);

      if (networkError.result && networkError.result.errors) {
        const errorMessage = networkError.result.errors[0].message;

        console.log("Error Message from Response:", errorMessage);
        if (user && errorMessage === "Invalid token") {
          localStorage.removeItem("user");
          document.location.href = "/";
        } else if (errorMessage === "Forbidden") {
          return <NotFoundPage />;
        }
      }
    }

    return <h2>{get_translation("INTERFACE_ERROR")}</h2>;
  }

  const handleNameChange = (e) => {
    setNameValue(e.target.value);
    setIsErrorVisible(false);
  };

  const handleSurnameChange = (e) => {
    setSurnameValue(e.target.value);
    setIsErrorVisible(false);
  };

  const handlePatronymicChange = (e) => {
    setPatronymicValue(e.target.value);
    setIsErrorVisible(false);
  };

  const handleLoginChange = (e) => {
    setLoginValue(e.target.value);
    setIsErrorVisible(false);
  };

  const handlePasswordChange = (e) => {
    setPasswordValue(e.target.value);
    setIsErrorVisible(false);
  };

  const handlePhoneChange = (e) => {
    setPhoneValue(e.target.value);
    setIsErrorVisible(false);
  };

  const handleCountryClick = (country, countryId) => {
    setSelectedCountry(country);
    setSelectedCountryId(countryId);
  };

  const handleDepartmentsOnChange = (departments) => {
    setSelectedDepartments(departments);
    setSelectedDepartmentsId(departments.map((department) => department.id));
    // console.log(departments);
  };

  const handleJobTitleClick = (jobTitle, jobTitleId) => {
    setSelectedJobTitle(jobTitle);
    setSelectedJobTitleId(jobTitleId);
  };

  const handlePeriodClick = (originalDate) => {
    const year = originalDate.getFullYear();
    const month = ("0" + (originalDate.getMonth() + 1)).slice(-2);
    const day = ("0" + originalDate.getDate()).slice(-2);

    const formattedDate = `${year}-${month}-${day}`;

    setSelectedDate(formattedDate);

    // console.log(formattedDate);
  };

  const errorMsg = () => {
    let error = "";

    if (nameValue.trim() == "") {
      error = get_translation("INTERFACE_ENTER_NAME");
    } else if (surnameValue.trim() == "") {
      error = get_translation("INTERFACE_ENTER_SURNAME");
    } else if (phoneValue.trim() == "") {
      error = get_translation("INTERFACE_ENTER_PHONE");
    } else if (selectedDate == null) {
      error = get_translation("INTERFACE_CHOOSE_DATE_OF_BIRTH");
    } else if (selectedCountryId == null) {
      error = get_translation("INTERFACE_CHOOSE_COUNTRY");
    } else if (loginValue.trim() == "") {
      error = get_translation("INTERFACE_ENTER_LOGIN");
    } else if (passwordValue.trim() == "") {
      error = get_translation("INTERFACE_ENTER_PASSWORD");
    } else if (passwordValue.trim().length < 6) {
      error = get_translation("INTERFACE_BAD_PASSWORD");
    } else if (selectedDepartmentsId == []) {
      error = get_translation("INTERFACE_SELECT_DEPARTMENT");
    } else if (selectedJobTitleId == null) {
      error = get_translation("INTERFACE_SELECT_JOB_TITLE");
    } else if (queryError == "Unsolvable") {
      error = "Введен уже существующий логин";
    } else {
      error = get_translation("INTERFACE_ERROR_ADD_CURATOR");
    }

    return error;
  };

  const handleAddCurator = async (e) => {
    e.preventDefault();

    // console.log(nameValue);
    // console.log(surnameValue);
    // console.log(patronymicValue);
    // console.log(phoneValue);
    // console.log(selectedDate);
    // console.log(loginValue);
    // console.log(passwordValue);
    // console.log(selectedDepartmentsId);
    // console.log(selectedJobTitle);
    // console.log(selectedJobTitleId);

    if (
      nameValue.trim() == "" ||
      surnameValue.trim() == "" ||
      phoneValue.trim() == "" ||
      selectedDate == null ||
      selectedCountryId == null ||
      loginValue.trim() == "" ||
      passwordValue.trim() == "" ||
      passwordValue.trim().length < 6 ||
      selectedDepartmentsId == [] ||
      selectedJobTitleId == null
    ) {
      setIsErrorVisible(true);
      return;
    }

    setIsErrorVisible(false);

    try {
      let result;
      if (patronymicValue.trim() == "") {
        result = await addHelperUser({
          variables: {
            token: user.token,
            name: nameValue.trim(),
            surname: surnameValue.trim(),
            phone: phoneValue.trim(),
            countryId: selectedCountryId,
            login: loginValue.trim(),
            password: passwordValue.trim(),
            departmentId: selectedDepartmentsId,
            birthday: selectedDate.trim(),
            jobTitleId: selectedJobTitleId,
          },
        });
      } else {
        result = await addHelperUser({
          variables: {
            token: user.token,
            name: nameValue.trim(),
            surname: surnameValue.trim(),
            patronymic: patronymicValue.trim(),
            phone: phoneValue.trim(),
            countryId: selectedCountryId,
            login: loginValue.trim(),
            password: passwordValue.trim(),
            departmentId: selectedDepartmentsId,
            birthday: selectedDate.trim(),
            jobTitleId: selectedJobTitleId,
          },
        });
      }

      console.log("Куратор успешно добавлен:", result);
      handleShowModal();
    } catch (error) {
      console.error("Ошибка при добавлении куратора:", error);
      setQueryError(error.networkError.result.errors[0].message);
      setIsErrorVisible(true);
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    goToAllCurators();
  };

  const newDepartmentList = departmentList.map((department) => ({
    name: department.name.stroke,
    id: department.id,
  }));

  return (
    <>
      {isAdmin() ? (
        <>
          <BackTitle
            title={get_translation("INTERFACE_ADD_CURATOR")}
            linkPrev={linkPrev}
          />
          <Row className="add-curator__row" style={{ marginTop: "20px" }}>
            <Col className="add-curator__column">
              <Form.Group controlId="NameForm">
                <Form.Control
                  type="text"
                  placeholder={get_translation("INTERFACE_NAME")}
                  value={nameValue}
                  className="add-curator__input"
                  onChange={handleNameChange}
                />
              </Form.Group>

              <Form.Group controlId="SurNameForm">
                <Form.Control
                  type="text"
                  placeholder={get_translation("INTERFACE_SURNAME")}
                  value={surnameValue}
                  className="add-curator__input"
                  onChange={handleSurnameChange}
                />
              </Form.Group>

              <Form.Group controlId="PatronymicForm">
                <Form.Control
                  type="text"
                  placeholder={get_translation("INTERFACE_PATRONYMIC_PRESENCE")}
                  value={patronymicValue}
                  className="add-curator__input"
                  onChange={handlePatronymicChange}
                />
              </Form.Group>

              <Form.Group controlId="PhoneForm">
                <Form.Control
                  type="phone"
                  placeholder={get_translation("INTERFACE_PHONE")}
                  value={phoneValue}
                  className="add-curator__input"
                  onChange={handlePhoneChange}
                />
              </Form.Group>

              <DatePicker
                id="DatePicker"
                placeholder={get_translation("INTERFACE_DATE_OF_BIRTHDAY")}
                className="add-curator__date-picker"
                locale={{
                  sunday: "Вс",
                  monday: "Пн",
                  tuesday: "Вт",
                  wednesday: "Ср",
                  thursday: "Чт",
                  friday: "Пн",
                  saturday: "Сб",
                  ok: "OK",
                  today: "Сегодня",
                  yesterday: "Вчера",
                }}
                format="dd.MM.yyyy"
                onChange={handlePeriodClick}
              />
            </Col>

            <Col className="add-curator__column">
              <DropdownButton
                id="dropdown-custom-1"
                title={selectedCountry || get_translation("INTERFACE_COUNTRY")}
              >
                {countryList.map((country, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={() =>
                      handleCountryClick(country.name.stroke, country.id)
                    }
                    href="#"
                  >
                    {country.name.stroke}
                  </Dropdown.Item>
                ))}
              </DropdownButton>

              <Form.Group controlId="LoginForm">
                <Form.Control
                  type="text"
                  placeholder={get_translation("INTERFACE_LOGIN")}
                  value={loginValue}
                  className="add-curator__input"
                  onChange={handleLoginChange}
                />
              </Form.Group>

              <Form.Group controlId="PasswordForm">
                <Form.Control
                  type="text"
                  placeholder={get_translation("INTERFACE_PASSWORD")}
                  value={passwordValue}
                  className="add-curator__input"
                  onChange={handlePasswordChange}
                />
              </Form.Group>

              <MultiSelect
                value={selectedDepartments}
                onChange={(e) => handleDepartmentsOnChange(e.value)}
                options={newDepartmentList}
                optionLabel="name"
                placeholder={get_translation("INTERFACE_SELECT_DEPARTMENT")}
                className="add-curator__multiselect"
              />

              <DropdownButton
                id="dropdown-custom-1"
                title={selectedJobTitle || get_translation("INTERFACE_JOB")}
              >
                {jobTitleList.map((jobTitle, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={() =>
                      handleJobTitleClick(jobTitle.name.stroke, jobTitle.id)
                    }
                    href="#"
                  >
                    {jobTitle.name.stroke}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </Col>
          </Row>
          <div className="error__col">
            {isErrorVisible && (
              <span className="form__error">{errorMsg()}</span>
            )}
            <ButtonCustom
              title={get_translation("INTERFACE_APPLY")}
              className={"add-curator__btn button-hover"}
              onClick={handleAddCurator}
            />
          </div>

          <ModalDialog
            show={showModal}
            onClose={handleCloseModal}
            modalTitle={get_translation("INTERFACE_MESSAGE_ADD_CURATOR")}
            modalBody={get_translation("INTERFACE_MESSAGE_ADD_CURATOR_FULL")}
          />
        </>
      ) : (
        <NotFoundPage />
      )}
    </>
  );
}

export default AddCurator;
