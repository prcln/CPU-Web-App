import React from "react";
import "./Settings.css"
import { t } from "../../../language/i18n";

export class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isToggleOn: true,
            memory: this.props.manager.Memory,
            quantum1: this.props.manager.quantum1,
            quantum2: this.props.manager.quantum2,
            semaphores: [].concat(this.props.manager.S),
            file: undefined,
            scenarioName: this.props.manager.scenarioName
        };

        this.GetToggleState = this.GetToggleState.bind(this);
    }

    GetToggleState() {
        return this.state.isToggleOn;
    }

    async handleClick() {
        this.setMemory({ target: { value: this.state.memory } });
        this.props.manager.quantum1 = this.state.quantum1;
        this.props.manager.quantum2 = this.state.quantum2;
        this.props.manager.settings.quantum1 = this.state.quantum1;
        this.props.manager.settings.quantum2 = this.state.quantum2;
        this.props.manager.S = this.state.semaphores;
        this.props.manager.scenarioName = this.state.scenarioName;
        this.props.close();
        if (this.state.file !== undefined) {
            if (typeof this.state.file === 'string') {
                let result = await fetch(this.state.file).then(response => response.text());
                this.props.manager.ReadText(result);
            } else {
                this.props.LoadFile(this.state.file);
            }
            this.setState({ file: undefined });
        }
    }

    closeSettings() {
        this.props.close();
    }

    setMemory(event) {
        let usedMemory = this.props.manager.Memory - this.props.manager.FreeMemory;
        if (usedMemory > event.target.value) {
            alert(`Currently using ${usedMemory} units of memory.`);
            event.target.value = usedMemory;
        }
        this.props.manager.FreeMemory = event.target.value - usedMemory;
        this.props.manager.Memory = event.target.value;
        this.props.manager.settings.maxMemory = event.target.value;
        this.setState({ memory: event.target.value })
    }

    updateMemory(event) {
        if (event.target.value < 0) {
            event.target.value = 0;
        }
        this.setState({ memory: event.target.value });
    }
    updateQuantum1(event) {
        if (event.target.value < 0) {
            event.target.value = 0;
        }
        this.setState({ quantum1: event.target.value });
    }
    updateQuantum2(event) {
        if (event.target.value < 0) {
            event.target.value = 0;
        }
        this.setState({ quantum2: event.target.value });
    }
    updateSemaphore1(event) {
        let semaphores = this.state.semaphores;
        semaphores[0] = event.target.value;
        this.setState({ semaphores: semaphores });
    }
    updateSemaphore2(event) {
        let semaphores = this.state.semaphores;
        semaphores[1] = event.target.value;
        this.setState({ semaphores: semaphores });
    }
    updateSemaphore3(event) {
        let semaphores = this.state.semaphores;
        semaphores[2] = event.target.value;
        this.setState({ semaphores: semaphores });
    }
    updateSemaphore4(event) {
        let semaphores = this.state.semaphores;
        semaphores[3] = event.target.value;
        this.setState({ semaphores: semaphores });
    }
    updateSemaphore5(event) {
        let semaphores = this.state.semaphores;
        semaphores[4] = event.target.value;
        this.setState({ semaphores: semaphores });
    }

    myFunction() {
        document.getElementById("myDropdown").classList.toggle("show");
    }

    setScenarioA() {
        this.setState({ scenarioName: 'Scenario A', file: 'inputFileA.txt' });
        document.getElementById("myDropdown").classList.toggle("show");
    }

    setScenarioB() {
        this.setState({ scenarioName: 'Scenario B', file: 'inputFileB.txt' });
        document.getElementById("myDropdown").classList.toggle("show");
    }

    setScenarioC() {
        // this.setState({ file: e.target.files[0] });
        this.setState({ scenarioName: 'Scenario C', file: 'inputFileC.txt' });
        document.getElementById("myDropdown").classList.toggle("show");
    }

    setScenarioD() {
        // this.setState({ file: e.target.files[0] });
        this.setState({ scenarioName: 'Scenario D', file: 'inputFileD.txt' });
        document.getElementById("myDropdown").classList.toggle("show");
    }

    setFile(e) {
        this.setState({ scenarioName: 'File Chosen', file: e.target.files[0] });
        document.getElementById("myDropdown").classList.toggle("show");
    }

    render() {
        return (
            <div className="modal">
                <div className="modal-content">
                    <h2 className="fixed-big"><center>{t("settings_title")}</center></h2>

                    <div className="SettingsRow">
                        <h2 className="SettingsFixed"><center>{t("settings_max_memory")}</center></h2>
                        <input className="SettingsInput" type="number"
                            value={this.state.memory} onSubmit={this.setMemory.bind(this)} onChange={this.updateMemory.bind(this)}
                        />
                    </div>
                    <div className="SettingsRow">
                        <h2 className="SettingsFixed"><center>{t("settings_quantum_1")}</center></h2>
                        <input className="SettingsInput" type="number"
                            value={this.state.quantum1} onChange={this.updateQuantum1.bind(this)}
                        />
                    </div>
                    <div className="SettingsRow">
                        <h2 className="SettingsFixed"><center>{t("settings_quantum_2")}</center></h2>
                        <input className="SettingsInput" type="number"
                            value={this.state.quantum2} onChange={this.updateQuantum2.bind(this)}
                        />
                    </div>
                    <div className="SettingsRow">
                        <h2 className="SettingsFixed"><center>{t("settings_sem_1")}</center></h2>
                        <input className="SettingsInput" type="number"
                            value={this.state.semaphores[0]} onChange={this.updateSemaphore1.bind(this)}
                        />
                    </div>
                    <div className="SettingsRow">
                        <h2 className="SettingsFixed"><center>{t("settings_sem_2")}</center></h2>
                        <input className="SettingsInput" type="number"
                            value={this.state.semaphores[1]} onChange={this.updateSemaphore2.bind(this)}
                        />
                    </div>
                    <div className="SettingsRow">
                        <h2 className="SettingsFixed"><center>{t("settings_sem_3")}</center></h2>
                        <input className="SettingsInput" type="number"
                            value={this.state.semaphores[2]} onChange={this.updateSemaphore3.bind(this)}
                        />
                    </div>
                    <div className="SettingsRow">
                        <h2 className="SettingsFixed"><center>{t("settings_sem_4")}</center></h2>
                        <input className="SettingsInput" type="number"
                            value={this.state.semaphores[3]} onChange={this.updateSemaphore4.bind(this)}
                        />
                    </div>
                    <div className="SettingsRow">
                        <h2 className="SettingsFixed"><center>{t("settings_sem_5")}</center></h2>
                        <input className="SettingsInput" type="number"
                            value={this.state.semaphores[4]} onChange={this.updateSemaphore5.bind(this)}
                        />
                    </div>

                    <div className="SettingsRow">
                        <h2 className="SettingsFixed"><center>{t("settings_choose_scenario")}</center></h2>
                        <div className="dropdown">
                            <button onClick={this.myFunction.bind(this)} className="SettingsButton">{t(this.state.scenarioName)}</button>
                            <div id="myDropdown" className="dropdown-content">
                                <button onClick={this.setScenarioA.bind(this)}>
                                    {t("settings_scenario_a")}
                                </button>
                                <button onClick={this.setScenarioB.bind(this)}>
                                    {t("settings_scenario_b")}
                                </button>
                                <button onClick={this.setScenarioC.bind(this)}>
                                    {t("settings_scenario_c")}
                                </button>
                                <button onClick={this.setScenarioD.bind(this)}>
                                    {t("settings_scenario_d")}
                                </button>
                                <div className="upload-btn-wrapper">
                                    <button> {t("settings_choose_file")} </button>
                                    <input type="file"
                                        name="myFile"
                                        onChange={this.setFile.bind(this)}
                                        accept='.txt'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>



                    <div className="row">
                        <div className="centered">
                            <button className="SettingsButton" onClick={this.handleClick.bind(this)}>
                                {t("settings_save")}
                            </button>
                        </div>
                        <div className="centered">
                            <button className="SettingsButton" onClick={this.closeSettings.bind(this)}>
                                {t("settings_close")}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default Settings;


// WEBPACK FOOTER //
// ./src/pages/simulator/Utils/Settings.js