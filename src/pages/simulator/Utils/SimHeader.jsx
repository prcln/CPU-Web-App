import React, { Component } from "react";
import "./SimHeader.css";
import CurrentTimeForm from "./CurrentTimeBox";
import { t } from "../../../language/i18n";

// import Toggle from "./Toggle";
import { HandleToggle } from './Toggle';






class SimHeader extends Component {
    constructor(props) {
        super(props);

        this.time = this.props.Time;
        this.ignoreAlerts = this.props.ignorealerts;

        this.Run100 = this.Run100.bind(this);
        this.Reset = this.Reset.bind(this);
        this.Complete = this.Complete.bind(this);
        this.Run1 = this.Run1.bind(this);
        this.TimeChanged = this.TimeChanged.bind(this);
        this.SliderChangedTime = this.SliderChangedTime.bind(this);
        this.SliderUpdatedTime = this.SliderUpdatedTime.bind(this);
        this.ToggleAlerts = this.ToggleAlerts.bind(this);
        this.ViewToggle = this.ViewToggle.bind(this);
        this.lastEvent = this.lastEvent.bind(this);
        this.nextEvent = this.nextEvent.bind(this);
        this.ShowSettings = this.ShowSettings.bind(this);

        this.state = { isAutoRunning: false, autoRunDelay: 1000, sliderValue: undefined, isDragging: false, dragDomain: null };
        this.toggleAutoRun = this.toggleAutoRun.bind(this);
        this.updateAutoRunDelay = this.updateAutoRunDelay.bind(this);
    }

    componentWillUnmount() {
        if (this.autoRunInterval) clearInterval(this.autoRunInterval);
    }

    toggleAutoRun() {
        if (this.state.isAutoRunning) {
            clearInterval(this.autoRunInterval);
            this.setState({ isAutoRunning: false });
        } else {
            this.autoRunInterval = setInterval(() => {
                this.props.nextEvent();
            }, this.state.autoRunDelay || 1000);
            this.setState({ isAutoRunning: true });
        }
    }

    updateAutoRunDelay(e) {
        const newDelay = parseInt(e.target.value, 10) || 0;
        this.setState({ autoRunDelay: newDelay });
        if (this.state.isAutoRunning) {
            clearInterval(this.autoRunInterval);
            this.autoRunInterval = setInterval(() => {
                this.props.nextEvent();
            }, newDelay || 1000);
        }
    }

    ShowSettings() {
        // alert('Settings are temporarily disabled.');
        this.props.SettingsToggle();
    }

    ViewToggle(value) {
        this.props.ViewToggle(value);
    }

    ToggleAlerts(value) {
        // console.log(value)
        this.props.ToggleAlerts(value);
    }

    Run1() {
        this.props.Run(1);
    }

    Run100() {
        this.props.Run(100);
    }

    Reset() {
        this.props.Reset(0);
        this.ChangeTime(0);
    }

    Complete() {
        this.props.Reset(30000);
        this.ChangeTime(30000);
    }

    lastEvent() {
        this.props.lastEvent();
    }

    nextEvent() {
        this.props.nextEvent();
    }

    SliderUpdatedTime(e) {
        var time = parseInt(e.target.value, 10);
        this.setState(prevState => ({
            sliderValue: time,
            isDragging: true,
            dragDomain: prevState.isDragging ? prevState.dragDomain : [this.time - 250, this.time + 250]
        }));
        this.TimeForm.UpdateTime(time);
    }

    SliderChangedTime(e) {
        var time = this.state.sliderValue;
        if (time === undefined) return;
        if (time < 0) {
            time = this.time === 0 ? 1 : 0;
        }
        if (time > 30000) {
            time = 30000;
        }
        this.setState({ sliderValue: undefined, isDragging: false, dragDomain: null });
        this.TimeChanged(time);
        this.TimeForm.UpdateTime(time);
    }

    TimeChanged(time) {
        console.log(time);
        this.time = time;
        this.props.UpdateManger(time);
        // this.setState({time: time});
    }

    ChangeTime(time) {
        this.time = time;
        this.TimeForm.UpdateTime(time);
    }

    render() {
        return (
            <div className="SimHeader header-container">

                <div className="outer-header-column-one">

                    <div className="header-column-one" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                        <h2>{t("nav_simulator")}</h2>
                        <button onClick={this.props.LogToggle} className="Thinner" style={{ height: '32px', lineHeight: '30px', minWidth: '120px', border: 'none' }}>
                            {t("btn_log")} ({this.props.manager.alerts ? this.props.manager.alerts.length : 0})
                        </button>
                    </div>

                    <div className="header-column-four">
                        <HandleToggle className='BigFont'
                            handleClick={this.ViewToggle}
                            off={t("toggle_hide_sem")}
                            on={t("toggle_show_sem")} />
                    </div>

                    <div className="header-column-seven">
                        <HandleToggle className='BigFont'
                            handleClick={this.ToggleAlerts}
                            off={t("toggle_disable_alerts")}
                            on={t("toggle_enable_alerts")}
                            initial={this.ignoreAlerts} />
                    </div>

                </div>

                <div className="outer-header-column-two">

                    <div className="header-column-two">
                        <div className="sub-header-column-one">
                            <button className="Thinner" onClick={this.Reset}>
                                {t("btn_reset")}
                            </button>
                        </div>
                        <div className="sub-header-column-two">
                            <h2>{t("lbl_simulation_time")}</h2>
                        </div>
                        <div className="sub-header-column-three">
                            <button className="Thinner" onClick={this.Complete}>
                                {t("btn_complete")}
                            </button>
                        </div>
                    </div>

                    <div className="header-column-five">
                        <div className="sub-header-column-one">
                            <button className="Thinner" onClick={this.lastEvent}>
                                {t("btn_last_event")}
                            </button>
                        </div>
                        <div className="sub-header-column-two" style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <CurrentTimeForm ref={c => this.TimeForm = c}
                                time={this.time} onChange={this.TimeChanged} />

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <button
                                    className={this.state.isAutoRunning ? "Thinner active-auto" : "Thinner"}
                                    onClick={this.toggleAutoRun}
                                    style={{
                                        minWidth: '120px',
                                        height: '35px',
                                        lineHeight: '33px',
                                        backgroundColor: this.state.isAutoRunning ? '#dc3545' : '#28a745',
                                        color: 'white',
                                        borderColor: this.state.isAutoRunning ? '#dc3545' : '#28a745',
                                        transition: 'all 0.3s'
                                    }}>
                                    {this.state.isAutoRunning ? t("btn_stop_auto") : t("btn_start_auto")}
                                </button>
                                <div style={{ display: 'flex', alignItems: 'center', padding: '2px 8px', borderRadius: '4px', height: '35px' }}>
                                    <input
                                        type="number"
                                        value={this.state.autoRunDelay}
                                        onChange={this.updateAutoRunDelay}
                                        style={{
                                            width: '50px',
                                            height: '32px',
                                            textAlign: 'center',
                                            border: 'none',
                                            color: 'inherit',
                                            backgroundColor: 'transparent',
                                            outline: '5px',
                                            borderRadius: '4px',
                                            fontWeight: 'bold'
                                        }}
                                        title={t("btn_delay")}
                                        min="10"
                                        step="100"
                                    />
                                    <span style={{ paddingLeft: '3px', fontSize: '16px', opacity: 0.8 }}>ms</span>
                                </div>
                            </div>
                        </div>
                        <div className="sub-header-column-three">
                            <button className="Thinner" onClick={this.nextEvent}>
                                {t("btn_next_event")}
                            </button>
                        </div>

                        {/* <button className="BigFont" onClick={this.Run1}>
                  Run 1
                </button>
                <button className="BigFont" onClick={this.Run100}>
                  Run 100
                </button>
                <button className="BigFont" onClick={this.Reset}>
                  Reset
                </button> */}
                    </div>

                    <div className="header-column-eight" style={{ padding: '0 20px', display: 'flex', alignItems: 'center' }}>

                        <input 
                            type="range" 
                            style={{ width: '100%', cursor: 'pointer', accentColor: '#2C4870' }}
                            min={this.state.isDragging && this.state.dragDomain ? this.state.dragDomain[0] : (this.time - 250)}
                            max={this.state.isDragging && this.state.dragDomain ? this.state.dragDomain[1] : (this.time + 250)}
                            value={this.state.sliderValue !== undefined ? this.state.sliderValue : this.time}
                            step="1"
                            onChange={this.SliderUpdatedTime}
                            onMouseUp={this.SliderChangedTime}
                            onTouchEnd={this.SliderChangedTime}
                        />

                    </div>

                </div>

                <div className="outer-header-column-three">

                    <div className="header-column-three">
                        <h2>{t("panel_cpu")}</h2>
                    </div>

                    <div className="header-column-six">
                        <HandleToggle className='BigFont'
                            handleClick={this.ShowSettings}
                            on={t("btn_settings")}
                            off={t("btn_settings")} />
                    </div>

                    <div className="header-column-nine">
                        {/* <HandleToggle className='BigFont'
                    handleClick = {this.ShowSettings}
                    on={`Available Memory: ${this.props.manager.FreeMemory}` } 
                    off={`Available Memory: ${this.props.manager.FreeMemory}` } /> */}
                        <h2 className="BigFont">{t("lbl_available_memory", this.props.manager.FreeMemory)}</h2>
                    </div>

                </div>
            </div>
        );
    }
}

export default SimHeader;


// WEBPACK FOOTER //
// ./src/pages/simulator/Utils/SimHeader.js