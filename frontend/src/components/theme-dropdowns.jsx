import { useState, useEffect } from "react";
import { DropdownButton, Dropdown } from "react-bootstrap";
import { useQuery } from "@apollo/client";

import { THEME_LIST } from "../apollo/queries";

import Loader from "../pages/loading";

import get_translation from "../helpers/translation";

export default function ThemeDropdowns({
  onUnitIdChange,
  onThemeIdChange,
  onSubThemeIdChange,
  isVisibleChange,
  onError,
}) {
  const [dataQuery, setData] = useState([]);

  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [selectedThemeId, setSelectedThemeId] = useState(null);
  const [selectedSubTheme, setSelectedSubTheme] = useState(null);
  const [selectedSubThemeId, setSelectedSubThemeId] = useState(null);

  const [isSubThemeDropdownVisible, setSubThemeDropdownVisible] =
    useState(true);

  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [language] = useState(localStorage.getItem("language"));

  const { loading, error, data } = useQuery(THEME_LIST, {
    variables: {
      token: user?.token,
      lang: language,
    },
  });

  useEffect(() => {
    if (data && data.clientQuery.allThemeTree) {
      setData(data.clientQuery.allThemeTree);
    }
  }, [data]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    onError(error);
    return null;
  }

  const handleUnitClick = (unit, unitId) => {
    setSelectedUnit(unit);
    setSelectedUnitId(unitId);
    onUnitIdChange(unitId);

    if (unit !== selectedUnit) {
      setSelectedTheme(null);
      setSelectedThemeId(null);
      setSelectedSubTheme(null);
      setSelectedSubThemeId(null);
      setSubThemeDropdownVisible(true);
      isVisibleChange(false);
    }
  };

  const handleThemeClick = (theme, themeId) => {
    setSelectedTheme(theme);
    setSelectedThemeId(themeId);
    onThemeIdChange(themeId);

    if (theme !== selectedTheme) {
      setSelectedSubTheme(null);
      setSelectedSubThemeId(null);
      setSubThemeDropdownVisible(true);
      isVisibleChange(false);
    }
  };

  const handleSubThemeClick = (subTheme, subThemeId) => {
    setSelectedSubTheme(subTheme);
    setSelectedSubThemeId(subThemeId);
    onSubThemeIdChange(subThemeId);

    isVisibleChange(false);
  };

  return (
    <>
      <div className="form__column">
        <DropdownButton
          id="dropdown-custom-1"
          title={selectedUnit || get_translation("INTERFACE_SELECT_UNIT")}
        >
          {dataQuery.map(
            (unit, index) =>
              unit.visibility !== 3 && (
                <Dropdown.Item
                  key={index}
                  onClick={() => handleUnitClick(unit.name.stroke, unit.id)}
                  href="#"
                >
                  {unit.name.stroke}
                </Dropdown.Item>
              )
          )}
        </DropdownButton>

        {selectedUnit && (
          <DropdownButton
            id="dropdown-custom-1"
            title={selectedTheme || get_translation("INTERFACE_TYPE_APPEALS")}
          >
            {dataQuery
              .find((unit) => unit.name.stroke === selectedUnit)
              ?.themes.map(
                (theme) =>
                  theme.visibility !== 3 && (
                    <Dropdown.Item
                      key={theme.id}
                      onClick={() =>
                        handleThemeClick(theme.name.stroke, theme.id)
                      }
                      href="#"
                    >
                      {theme.name.stroke}
                    </Dropdown.Item>
                  )
              )}
          </DropdownButton>
        )}

        {isSubThemeDropdownVisible && selectedTheme && (
          <DropdownButton
            id="dropdown-custom-1"
            title={selectedSubTheme || get_translation("INTERFACE_SUBTHEME")}
          >
            {dataQuery
              .find((unit) => unit.name.stroke === selectedUnit)
              ?.themes.find((theme) => theme.name.stroke === selectedTheme)
              ?.subThemes.map(
                (subTheme) =>
                  subTheme.visibility !== 3 && (
                    <Dropdown.Item
                      key={subTheme.id}
                      onClick={() =>
                        handleSubThemeClick(subTheme.name.stroke, subTheme.id)
                      }
                      href="#"
                    >
                      {subTheme.name.stroke}
                    </Dropdown.Item>
                  )
              )}
          </DropdownButton>
        )}
      </div>
    </>
  );
}
