import {useState, useEffect, useRef} from "react";
import phoneCountryCode from './phone_country_code.json'
import './PhoneCountrySelect.css'

const PhoneCountrySelect = () => {

    const [isOpen, setIsOpen] = useState(false)
    const [countryList, setCountryList] = useState([])
    const [countrySelected, setCountrySelected] = useState([])
    const countrySelectedRef = useRef(null)
    const countryDropdownRef = useRef(null)

    useEffect(() => {
        // init countryList base on phoneCountryCode json.
        const tempCountryList = [];
        phoneCountryCode.forEach((country) => {
            tempCountryList.push({
                countryCode: country['country_code'],
                code: `+${country['phone_code']}`,
                name: country['country_en'],
                visible: true // for search use
            })
        })
        setCountryList(tempCountryList);
        setCountrySelected(tempCountryList[0])
    }, [])

    function itemClickHandler(item) {
        setCountrySelected(item)
        setIsOpen(false)
    }

    useEffect(() => {
        function documentClickHandler(event) {
            if (countryDropdownRef.current && countryDropdownRef.current.contains(event.target)) {
                return false;
            }
            if (countrySelectedRef.current && countrySelectedRef.current.contains(event.target)) {
                setIsOpen(true)
            } else {
                setIsOpen(false)
            }
        }
        document.addEventListener('click', documentClickHandler);
        return () => {
            document.removeEventListener('click', documentClickHandler)
        }
    }, [])

    // search by code or name
    const [searchText, setSearchText] = useState('')
    useEffect(() => {
        if (searchText && searchText.length > 0) {
            const newCountryList = countryList.map(country => {
                if (country.name.toLowerCase().includes(searchText.toLowerCase()) || country.code.toString().includes(searchText)) {
                    country.visible = true
                } else {
                    country.visible = false
                }
                return country;
            })
            setCountryList(newCountryList)
        }
    }, [searchText])

    // flag icon lazy load
    const [flagLoaded, setFlagLoaded] = useState(false)
    function flagLazyLoad() {
        if (flagLoaded) return;
        const callback = entries => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const image = entry.target.querySelector('.phone-country-select-list-flag')
                    const data_src = image.getAttribute('data-src')
                    image.setAttribute('src', data_src)
                    observer.unobserve(entry.target)
                }
            })
        }
        const observer = new IntersectionObserver(callback, {
            root: document.querySelector('.phone-country-select-dropdown ul')
        })
        const images = document.querySelectorAll('.phone-country-select-dropdown ul li')
        images.forEach(image => {
            observer.observe(image)
        })
        setFlagLoaded(true)
    }

    useEffect(() => {
        if (isOpen) {
            flagLazyLoad();
        }
    }, [isOpen])

    return (
        <div className="phone-country-select-container">
            <div className="phone-country-select-selected" ref={countrySelectedRef}>
                {
                  (countrySelected && countrySelected.countryCode) &&
                  <>
                      <img src={`/flags/${countrySelected.countryCode}.svg`} />
                      <span className="phone-country-select-selected-name">{countrySelected.name}</span>
                      <span className="phone-country-select-selected-code">{countrySelected.code}</span>
                  </>
                }
            </div>
            <div className={"phone-country-select-dropdown " + (isOpen ? 'open' : 'closed')} ref={countryDropdownRef}>
                <div className="phone-country-select-search">
                    <input type="text" placeholder="Search by Name or Code" onChange={e => setSearchText(e.target.value)} />
                    <img src="/clear.svg" />
                </div>
                <ul>
                    {
                        countryList.map((item, index) => (
                          <li key={index} onClick={() => itemClickHandler(item)} className={(item.visible ? 'show' : 'hide')}>
                              <img className="phone-country-select-list-flag" data-src={`/flags/${item.countryCode}.svg`} />
                              <span className="phone-country-select-list-name">{item.name}</span>
                              <span className="phone-country-select-list-code">{item.code}</span>
                          </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )

}

export default PhoneCountrySelect