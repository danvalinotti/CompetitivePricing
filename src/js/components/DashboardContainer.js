import React, {Component} from 'react'
import HeaderComponent from './HeaderComponent'
import '../../assests/sass/dashboardstyles.css'
import Typography from '@material-ui/core/Typography'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import {withRouter} from 'react-router-dom'
import Axios from 'axios'
import {authenticateUser} from '../services/authService';
import CircularProgress from "@material-ui/core/CircularProgress";
import DashboardTable from "./DashboardTable";

class DashBoardContainer extends Component {
    constructor(props) {
        super(props);
        authenticateUser(this);
        this.state = {
            dashBoardDrugsData: [],
            filteredList: [],
            drugSort: 'off',
            insideRxSort: 'off',
            pharmCardSort: 'off',
            wellRxSort: 'off',
            medImpactSort: 'off',
            singleCareSort: 'off',
            blinkHealthSort: 'off',
            goodRxSort: 'off',
            lowestPriceSort: 'off',
            loggedInProfile: {},
            dashboardLoading: true,
            loadingDialog: false,
            snackbarOpen: false,
            snackbarMessage: "",
            deleteOk: false
        };

        this.getDashboardDrugs();
        this.clickHome = this.clickHome.bind(this);
        this.clickDashboard = this.clickDashboard.bind(this);
        this.clickReports = this.clickReports.bind(this);
        this.toggleDialog = this.toggleDialog.bind(this);
        this.handleCloseSnackbar = this.handleCloseSnackbar.bind(this);
    }

    toggleDialog() {
        let s = !this.state.loadingDialog;
        this.setState({
            loadingDialog: s
        });
    }

    exportDrugs() {
        const exportList = [
            [
                'Drug Name',
                'Drug Type',
                'Dosage Strength',
                'Quantity',
                'Zip Code',
                'Inside Rx Price',
                'U.S Pharmacy Card Price',
                'Well Rx Price',
                'MedImpact Price',
                'Singlecare Price',
                'Blink Price',
                'GoodRx Price',
                'Recommended Price',
                'Difference'
            ]
        ];
        this.state.filteredList.forEach((element) => {
            const row = [
                element.name,
                element.drugType,
                element.dosageStrength + ' ' + element.dosageUOM,
                element.quantity,
                '= "' + element.zipcode + '"',
                element.programs[0].price,
                element.programs[1].price,
                element.programs[2].price,
                element.programs[3].price,
                element.programs[4].price,
                element.programs[5].price,
                element.programs[6].price,
                element.recommendedPrice,
                element.recommendedDiff
            ];
            exportList.push(row)
        });
        let csvContent = 'data:text/csv;charset=utf-8,';
        exportList.forEach(function (rowArray) {
            let row = rowArray.join(',');
            csvContent += row + '\r\n'
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'DashboardDrugs.csv');
        document.body.appendChild(link); // Required for FF
        link.click() // This will download the data file named "my_data.csv".
    }

    getDashboardDrugs() {
        const token = window.sessionStorage.getItem('token');
        const payload = {
            token: token
        };
        this.setState({
            dashboardLoading: true
        });
        Axios.post(process.env.API_URL + '/dashboard/user/get', payload).then(response => {
            console.log(response.data);
            let data = response.data;
            this.setState({
                dashBoardDrugsData: response.data,
                filteredList: response.data,
                dashboardLoading: false
            })
        })
    }

    filterList(event) {
        const str = event.target.value.toLowerCase();
        const filteredList = [];
        this.state.dashBoardDrugsData.map(val => {
            const drugName = val.name.toLowerCase();
            if (drugName.includes(str)) {
                filteredList.push(val)
            }
        });
        this.setState({
            filteredList: filteredList
        })
    }

    clickHome() {
        this.props.history.push({pathname: '/search'})
    }

    clickDashboard() {
        this.props.history.push({pathname: '/viewDashboard'})
    }

    clickReports() {
        this.props.history.push({pathname: '/reports'})
    }

    handleCloseSnackbar() {
        this.setState({
            snackbarOpen: false
        });
    }

    render() {
        return (
            <div>
                <HeaderComponent
                    profile={this.state.loggedInProfile}
                    value={1}
                    clickHome={this.clickHome}
                    clickDashboard={this.clickDashboard}
                    history={this.props.history}
                    clickReports={this.clickReports}
                />

                <div style={{paddingLeft: '5%', paddingRight: '5%'}}>
                    <div
                        className='row'
                        style={{paddingTop: '3%', marginRight: '0px', marginLeft: '0px'}}
                    >
                        <div
                            style={{
                                display: 'flex',
                                fontWeight: 'bold',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%',
                                paddingLeft: '5%',
                                paddingRight: '5%'
                            }}
                        >
                            <Typography
                                style={{
                                    padding: '10px',
                                    paddingLeft: '0px',
                                    fontSize: '2rem'
                                }}
                            >
                                Competitive Pricing
                            </Typography>
                            <div className=' headerZip' style={{padding: '0px'}}>
                                <input
                                    className='form-control search-bar '
                                    onChange={() => {
                                        this.filterList(event)
                                    }}
                                    type='text'
                                    id='myZipCode'
                                    placeholder='Filter Dashboard Drugs'
                                />
                            </div>
                        </div>
                    </div>
                    <div style={{paddingTop: '30px'}}>
                        {this.state.filteredList.length === 0 && !this.state.dashboardLoading ? (
                            <div style={{textAlign: 'center'}} className='highlightedCell'>
                                No Drugs Added To Dashboard
                            </div>
                        ) : [(this.state.dashboardLoading
                                ? (
                                    <div
                                        style={{
                                            textAlign: 'center',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            paddingTop: 30
                                        }}
                                    >
                                        <CircularProgress size={60}/>
                                        <p style={{paddingTop: 15, fontSize: "1.25rem", fontWeight: 500, fontStyle: "italic", color: "#363647"}}>
                                            Loading Dashboard prices...<br/>
                                            This may take a minute.
                                        </p>
                                    </div>
                                ) : (
                                    <DashboardTable filteredList={this.state.filteredList}/>
                                )
                        )]}
                    </div>
                    <div style={{paddingRight: '0px', paddingTop: '15px'}}>
                        <div className='float-sm-right'>
                            <button
                                type='button'
                                style={{marginRight: '10px', display: 'flex'}}
                                onClick={() => {
                                    this.exportDrugs()
                                }}
                                className='btn btn-outline-primary'
                            >
                                <CloudDownloadIcon style={{paddingRight: 5}}/>
                                Export
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default withRouter(DashBoardContainer)
