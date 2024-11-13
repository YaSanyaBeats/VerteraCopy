import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Row, Col, Dropdown, DropdownButton } from "react-bootstrap";

import { THEME_LIST, HELPER_PERMS } from "../apollo/queries";
import { ADD_THEME } from "../apollo/mutations";

import Loader from "../pages/loading";
import ButtonCustom from "../components/button";
import BackTitle from "../components/back-title";
import ModalDialog from "../components/modal-dialog";
import NotFoundPage from "./not-found-page";

import "../css/add-theme.css";

import get_translation from "../helpers/translation";

function AddTheme() {
  const [dataQuery, setData] = useState([]);
  const location = useLocation();
  const [linkPrev, setLinkPrev] = useState(null);

  const [isErrorVisible, setIsErrorVisible] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const modalTitle = "Тема создана";
  const modalBody = "Новая тема успешно создана";

  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [nameValue, setNameValue] = useState("");

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
      user.role === "system" || dataPerms?.helperQuery?.helperPerms.themeEdit
    );
  };

  const { loading, error, data } = useQuery(THEME_LIST, {
    variables: {
      token: user.token,
      lang: language,
    },
  });

  const navigate = useNavigate();

  const goToAllThemes = () => {
    navigate("/themes");
  };

  useEffect(() => {
    if (data && data.clientQuery.allThemeTree) {
      setData(data.clientQuery.allThemeTree);
    }

    setLinkPrev("/themes");
  }, [data, location.state]);

  const [addTheme] = useMutation(ADD_THEME);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    const networkError = error.networkError;

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

  const handleUnitClick = (unit, unitId) => {
    setSelectedItem(unit);
    setSelectedUnit(unit);
    setSelectedUnitId(unitId);

    setIsErrorVisible(false);
    // console.log(unitId);
  };

  const handleNameChange = (e) => {
    setNameValue(e.target.value);
    setIsErrorVisible(false);
  };

  const errorMsg = () => {
    let error = "";

    if (selectedUnit == null) {
      error = get_translation("INTERFACE_SELECT_UNIT");
    } else if (nameValue.trim() == "") {
      error = get_translation("INTERFACE_ENTER_THEME");
    } else {
      error = get_translation("INTERFACE_ERROR_ADD_THEME");
    }

    return error;
  };

  const handleAddTheme = async (e) => {
    e.preventDefault();

    // console.log(selectedUnit);
    // console.log(selectedUnitId);
    // console.log(nameValue);

    if (nameValue.trim() == "" || selectedUnit == null) {
      setIsErrorVisible(true);
      return;
    }

    setIsErrorVisible(false);

    try {
      const result = await addTheme({
        variables: {
          token: user.token,
          unitId: selectedUnitId,
          stroke: nameValue.trim(),
          lang: "ru",
          visibility: 1,
        },
      });

      console.log("Тема успешно добавлена:", result);
      handleShowModal();
    } catch (error) {
      console.error("Ошибка при добавлении темы:", error);
      setIsErrorVisible(true);
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    goToAllThemes();
  };

  return (
    <>
      {isAdmin() ? (
        <>
          <BackTitle
            title={get_translation("INTERFACE_ADD_THEME")}
            linkPrev={linkPrev}
          />
          <Row className="add-curator__row" style={{ marginTop: "20px" }}>
            <Col className="add-curator__column add-theme__column">
              <DropdownButton
                id="dropdown-custom-1"
                title={selectedItem || get_translation("INTERFACE_SELECT_UNIT")}
                className="add-theme__dropdown"
              >
                {dataQuery.map(
                  (unit, index) =>
                    unit.visibility !== 3 && (
                      <Dropdown.Item
                        key={index}
                        onClick={() =>
                          handleUnitClick(unit.name.stroke, unit.id)
                        }
                        href="#"
                      >
                        {unit.name.stroke}
                      </Dropdown.Item>
                    )
                )}
              </DropdownButton>

              <Form.Group controlId="NameForm">
                <Form.Control
                  type="text"
                  placeholder={get_translation("INTERFACE_THEME_NAME")}
                  value={nameValue}
                  className="add-currator__input add-theme__dropdown"
                  onChange={handleNameChange}
                />
              </Form.Group>
              {isErrorVisible && (
                <span className="form__error">{errorMsg()}</span>
              )}
              <ButtonCustom
                title={get_translation("INTERFACE_APPLY")}
                className={"add-curator__btn button-hover"}
                onClick={handleAddTheme}
              />
            </Col>
          </Row>

          <ModalDialog
            show={showModal}
            onClose={handleCloseModal}
            modalTitle={get_translation("INTERFACE_MESSAGE_THEME_CREATION")}
            modalBody={get_translation("INTERFACE_MESSAGE_THEME_CREATION_FULL")}
          />
        </>
      ) : (
        <NotFoundPage />
      )}
    </>
  );
}

export default AddTheme;
