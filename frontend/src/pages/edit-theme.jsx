import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { Form, Row, Col, Dropdown, DropdownButton } from "react-bootstrap";

import { THEME, THEME_LIST, HELPER_PERMS } from "../apollo/queries";
import { EDIT_THEME } from "../apollo/mutations";

import BackTitle from "../components/back-title";
import Loader from "../pages/loading";
import ButtonCustom from "../components/button";
import ModalDialog from "../components/modal-dialog";
import NotFoundPage from "./not-found-page";

import get_translation from "../helpers/translation";

function EditTheme() {
  const { themeId } = useParams();
  const location = useLocation();
  const [linkPrev, setLinkPrev] = useState(null);

  const [dataQuery, setData] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [nameValue, setNameValue] = useState("");
  const [visibility, setVisibility] = useState(null);

  const [isErrorVisible, setIsErrorVisible] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const visibilityItems = {
    1: get_translation("INTERFACE_VISIBILITY_ALL"),
    2: get_translation("INTERFACE_VISIBILITY_CURATORS"),
    3: get_translation("INTERFACE_VISIBILITY_NONE"),
  };

  const findKeyByValue = (obj, value) =>
    Object.keys(obj).find((key) => obj[key] === value);

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

  const {
    loading: loadingTheme,
    error: errorTheme,
    data: dataTheme,
  } = useQuery(THEME_LIST, {
    variables: {
      token: user.token,
      lang: language,
    },
  });
  const { loading, error, data, refetch } = useQuery(THEME, {
    variables: {
      token: user.token,
      id: parseInt(themeId),
      lang: language,
    },
  });

  const [editTheme, { loading: loadingEditTheme }] = useMutation(EDIT_THEME);

  const navigate = useNavigate();

  const goToAllThemes = () => {
    navigate("/themes");
  };

  useEffect(() => {
    if (dataTheme && dataTheme.clientQuery.allThemeTree) {
      setData(dataTheme.clientQuery.allThemeTree);
      // console.log(data.allThemeTree.map((unit) => unit.id));
    }

    if (data && data.helperQuery.theme) {
      setNameValue(data.helperQuery.theme.name.stroke);
      setSelectedUnit(data.helperQuery.theme.unit.name.stroke);
      setSelectedUnitId(data.helperQuery.theme.unit.id);
      setVisibility(data.helperQuery.theme.visibility);
      // console.log(data.theme.unit.id);
    }

    setLinkPrev("/themes");

    refetch();
  }, [data, dataTheme, location.state]);

  if (loading || loadingEditTheme || loadingTheme) {
    return <Loader />;
  }

  if (error || errorTheme) {
    const networkError = error.networkError ?? errorTheme.networkError;

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
    setSelectedUnit(unit);
    setSelectedUnitId(unitId);

    setIsErrorVisible(false);
    // console.log(unitId);
  };

  const handleOnChangeName = (e) => {
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
      error = get_translation("INTERFACE_ERROR_THEME_CHANGE");
    }

    return error;
  };

  const handleEditTheme = async (e) => {
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
      const result = await editTheme({
        variables: {
          token: user.token,
          id: parseInt(themeId),
          unitId: selectedUnitId,
          stroke: nameValue.trim(),
          lang: "ru",
          visibility: parseInt(visibility),
        },
      });

      console.log("Тема успешно обновлена:", result);
      handleShow();
    } catch (error) {
      console.error("Ошибка при обновлении темы:", error);
      setIsErrorVisible(true);
    }
  };

  const handleShow = () => {
    setShowModal(true);
  };

  const handleCloseLeave = () => {
    setShowModal(false);
    goToAllThemes();
  };

  const handleVisibilityClick = (visibility) => {
    setVisibility(findKeyByValue(visibilityItems, visibility));
  };

  return (
    <>
      {isAdmin() ? (
        <>
          <BackTitle
            title={`${get_translation("INTERFACE_EDIT_THEME")} #${themeId}`}
            linkPrev={linkPrev}
          />
          <Row style={{ marginTop: "20px" }} className="edit-theme__container">
            <Col className="edit-curator__column edit-theme__column">
              <DropdownButton
                id="dropdown-custom-1"
                title={selectedUnit}
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
                <Form.Label className="edit-curator__field-label">
                  {get_translation("INTERFACE_THEME_NAME")}
                </Form.Label>
                <Form.Control
                  type="text"
                  className="add-currator__input add-theme__dropdown"
                  value={nameValue}
                  onChange={handleOnChangeName}
                />

                <Form.Label
                  className="edit-curator__field-label"
                  style={{ marginTop: "20px" }}
                >
                  {get_translation("INTERFACE_ORDER")}
                </Form.Label>
                <DropdownButton
                  id="dropdown-custom-1"
                  title={
                    visibilityItems[visibility] ||
                    get_translation("INTERFACE_VISIBILITY_LEVEL")
                  }
                >
                  {Object.values(visibilityItems).map((item, index) => (
                    <Dropdown.Item
                      key={index}
                      onClick={() => handleVisibilityClick(item)}
                      href="#"
                    >
                      {item}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              </Form.Group>

              <div className="edit-curator__column">
                {isErrorVisible && (
                  <span className="form__error">{errorMsg()}</span>
                )}
                <div className="edit-curator__btn-row">
                  <ButtonCustom
                    title={get_translation("INTERFACE_APPLY")}
                    className={
                      "add-curator__btn edit-curator__btn button-hover"
                    }
                    onClick={handleEditTheme}
                  />
                </div>
              </div>
            </Col>
          </Row>

          <ModalDialog
            show={showModal}
            onClose={handleCloseLeave}
            modalTitle={get_translation("INTERFACE_THEME_CHANGED")}
            modalBody={get_translation("INTERFACE_THEME_CHANGED_FULL")}
          />
        </>
      ) : (
        <NotFoundPage />
      )}
    </>
  );
}

export default EditTheme;
