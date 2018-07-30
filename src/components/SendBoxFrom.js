import React, { Component } from 'react'


import Dropdown from 'react-dropdown'// https://github.com/fraserxu/react-dropdown
/*const options = [
    { value: 0.01, label: '0.01 EHTER' },
    { value: 0.1, label: '0.1 ETHER' },
    { value: 1, label: '1 ETHER' },
  ]
            
  const defaultOption = this.state.selected*/
/*<Dropdown options={options} onChange={this.Ondropdownchange} value={defaultOption} placeholder="Select an option" /> */
import 'react-dropdown/style.css'
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

//import { Jumbotron , Container} from 'react-bootstrap'

//import '../css/Header.css'

const styles = theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    formControl: {
     
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing.unit * 2,
    },
    button: {
        margin: theme.spacing.unit,
      },
      leftIcon: {
        marginRight: theme.spacing.unit,
      },
      rightIcon: {
        marginLeft: theme.spacing.unit,
      },
      iconSmall: {
        fontSize: 20,
      },
  });



  const cansendeth = [
    {
      value: 0.01,
      label: '0.01 ETH',
    },
    {
      value: 0.1,
      label: '0.1 ETH',
    },
    {
      value: 1,
      label: '1 ETH',
    },    
  ];


class SendBoxForm extends Component {
    constructor(props) {
      super(props)
  
      this.state = {
      
        BoxMessageValue: '',
        BoxETHValue: 0.01 ,
        selected: { value: 0.01, label: '0.01 EHTER' }
     }

        //this.onSendABox = this.onSendABox.bind(this);
        this.BoxMessageInput = this.BoxMessageInput.bind(this);
        //.BoxETHInput = this.BoxETHInput.bind(this);
        //this.radiocheckchange = this.radiocheckchange.bind(this);
        this.Ondropdownchange = this.Ondropdownchange.bind(this);
        
        this.onSubmit = this.onSubmit.bind(this);
    }

        
    onSubmit(e) {
        e.preventDefault();
        this.props.onSubmit({
       // price: web3.utils.toWei(this.state.price, this.state.unit),
            BoxETHValue: this.state.BoxETHValue,
            BoxMessageValue: this.state.BoxMessageValue
       
        });
    }
    
    componentWillMount() {
        console.log('componentWillMount SendBoxForm');

    }

    componentDidMount(){
        console.log('componentDidMount SendBoxForm');
      
    }
  
    BoxMessageInput(event) {
         console.log(event.target.value);
        this.setState ({
        BoxMessageValue: event.target.value
        });
    }
    

  Ondropdownchange(option) {
    
        console.log(`You selected ${option.label}, with value ${option.value}`)
     
        this.setState ({
        BoxETHValue: parseFloat(option.value)
        });

        this.setState({selected: option});
    }

    handleChange = event => {
        console.log(event.target.value );
        console.log(event.target.name);
        this.setState({ [event.target.name]: event.target.value });
    };

    render() {
        
          const { classes } = this.props;

          return (
            <div>
            <h4>FAQ</h4>
            <hr style={{
              borderColor:"red",
              borderWidth:"2px",
            }}/>
          
                <form onSubmit={this.onSubmit}>
                <h4>Send</h4>
                <div  style={{ width:"150px"}}>
               
                    <FormControl className={classes.formControl}>
                      
                        <Select
                            value={this.state.BoxETHValue}
                            onChange={this.handleChange}
                            input={<Input name="BoxETHValue" id="eth-helper" />}
                        >
                         {
                             cansendeth.map(option => (

                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem> 
                         ))
                        }
                        </Select>
                        <FormHelperText>Some important helper text</FormHelperText>
                        </FormControl>
                </div>
             
                <div >
                    <TextField
                        id="full-width"
                        label="Message"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        placeholder="Placeholder"
                        helperText="Full width!"
                        fullWidth
                        margin="normal"
                        value={this.state.BoxMessageValue} 
                        onChange={this.BoxMessageInput}
                    />

                </div>   
                <br/>
                <div>
                    <Button variant="contained" color="primary" className={classes.button} type="submit">
                        Send
                      
                    </Button>
        
                </div>
                </form>
           </div>
         
        );

    }
}


export default withStyles(styles)(SendBoxForm)