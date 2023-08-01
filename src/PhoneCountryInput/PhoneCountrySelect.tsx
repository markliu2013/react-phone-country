import React, { useState, useEffect, useRef } from 'react';
import FlagSvg from "./FlagSvg";
import phoneCountryCode from './phone_country_code.json';
import './PhoneCountrySelect.css';
import { Country } from './types';

const PhoneCountrySelect: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [countryList, setCountryList] = useState<Country[]>([]);
  const [countrySelected, setCountrySelected] = useState<Country>();
  const countrySelectedRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // init countryList base on phoneCountryCode json.
  useEffect(() => {
    const tempCountryList: Country[] = [];
    phoneCountryCode.forEach((country) => {
      tempCountryList.push({
        countryCode: country['country_code'],
        code: `+${country['phone_code']}`,
        name: country['country_en'],
        visible: true, // for search use
      });
    });
    setCountryList(tempCountryList);
    setCountrySelected(tempCountryList[0]);
  }, []);

  // select country
  function itemClickHandler(item: Country) {
    setCountrySelected(item);
    setIsOpen(false);
  }

  useEffect(() => {
    // toggle dropdown
    function documentClickHandler(event: Event) {
      const target = event.target as HTMLInputElement;
      if (countryDropdownRef.current && countryDropdownRef.current.contains(target)) {
        return false;
      }
      if (countrySelectedRef.current && countrySelectedRef.current.contains(target)) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }
    document.addEventListener('click', documentClickHandler);
    return () => {
      document.removeEventListener('click', documentClickHandler);
    };
  }, []);

  // search by code or name
  const [searchText, setSearchText] = useState<string>('');
  useEffect(() => {
    if (countryList.length < 1) return; // search should run after countryList data loaded
    let newCountryList: Country[];
    if (searchText && searchText.length > 0) {
      newCountryList = countryList.map((country) => {
        if (
          country.name.toLowerCase().includes(searchText.toLowerCase()) ||
          country.code.toString().includes(searchText)
        ) {
          country.visible = true;
        } else {
          country.visible = false;
        }
        return country;
      });
    } else {
      newCountryList = countryList.map((country) => {
        country.visible = true;
        return country;
      });
    }
    setCountryList(newCountryList);
  }, [searchText]);

  return (
    <div className='phone-country-select-container'>
      <div className='phone-country-select-selected' ref={countrySelectedRef}>
        {countrySelected && countrySelected.countryCode && (
          <>
            <img src={`/flags/${countrySelected.countryCode}.svg`} />
            <span className='phone-country-select-selected-name'>{countrySelected.name}</span>
            <span className='phone-country-select-selected-code'>{countrySelected.code}</span>
          </>
        )}
      </div>
      <div
        className={'phone-country-select-dropdown ' + (isOpen ? 'open' : 'closed')}
        ref={countryDropdownRef}
      >
        <div className='phone-country-select-search'>
          <input
            type='text'
            placeholder='Search by Name or Code'
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <img src='/clear.svg' onClick={() => setSearchText('')} />
        </div>
        <ul>
          {countryList.map((item, index) => (
            <li
              key={index}
              onClick={() => itemClickHandler(item)}
              className={item.visible ? 'show' : 'hide'}
            >
              <FlagSvg code={item.countryCode} />
              <span className='phone-country-select-list-name'>{item.name}</span>
              <span className='phone-country-select-list-code'>{item.code}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PhoneCountrySelect;
