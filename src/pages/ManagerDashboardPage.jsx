import { useState, useEffect, useMemo } from 'react';
import './ManagerDashboardPage.css'
import DashboardButton from '../components/DashboardButton';
import DashboardView from '../components/DashboardView';
import AllCheckinsView from '../components/AllCheckinView';
import Loader from '../components/Loader'
import { useAuth } from '../hooks/use-auth';
import useTeams from '../hooks/use-teams';
import useCheckins from '../hooks/use-checkins';
import useCheckinsHistory from '../hooks/use-checkins-history';
import useMoods from '../hooks/use-moods';
import useWorkloads from '../hooks/use-workloads';


function DashboardPage() {
    const { teams, teamisLoading } = useTeams();
    const { moods, moodisLoading } = useMoods();
    const { workloads, workloadisLoading } = useWorkloads();
    const { pulseLogs, checkinisLoading } = useCheckins();
    const { pulseLogs: historicalPulseLogs, checkinisLoading: historyisLoading } = useCheckinsHistory();
    const { auth, setAuth } = useAuth();

    const [view, setView] = useState("dashboard");
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [showPlaceholder, setShowPlaceholder] = useState(true);


    const myTeams = useMemo(() => {
        if (!auth) {
            return [];
        }

        const filtered = teams.filter(
            (t) => Number(t.team_manager) === Number(auth.user.id)
        );
        return filtered;
    }, [teams, auth.user]);

    useEffect(() => {
        if (myTeams.length > 0 && !selectedTeam) {
            setSelectedTeam(myTeams[0].id);
        }
    }, [myTeams]);



    const teamLogs = useMemo(() => {
        if (!selectedTeam) return [];
        return pulseLogs.filter(log => log.team === selectedTeam);
    }, [pulseLogs, selectedTeam]);

    const teamLogsHistory = useMemo(() => {
        if (!selectedTeam) return [];
        return historicalPulseLogs.filter(log => log.team === selectedTeam);
    }, [historicalPulseLogs, selectedTeam]);

    const selectedTeamObj = useMemo(() => {
        return teams.find((t) => t.id === selectedTeam);
    }, [teams, selectedTeam]);

    const totalMembers = selectedTeamObj?.user_count;

    const participationRate = useMemo(() => {
        if (!selectedTeamObj) return 0;
        if (totalMembers === 0) return 0;

        return teamLogs.length / totalMembers;
    }, [teamLogs, selectedTeamObj]);

    const participationPercentage = Math.round(participationRate * 100);


    const isLoading =
        moodisLoading ||
        teamisLoading ||
        checkinisLoading ||
        workloadisLoading ||
        historyisLoading;

    if (isLoading) {
        return <Loader />;
    }

    if (myTeams.length === 0) {
        return (
            <p className="no-teams-message">
                Seems like you don't have any teams assigned to you yet.
            </p>
        );
    }


    return (
        <section className='dashboard-container'>
            <div className='dashboard-switchview justify-center flex'>
                <DashboardButton
                    text='Dashboard'
                    isActive={view === "dashboard"}
                    onClick={() => setView("dashboard")}
                />
                <DashboardButton
                    text='All Check-ins'
                    isActive={view === "checkins"}
                    onClick={() => setView("checkins")}
                />
            </div>

            {/* mobile view */}
            <div className='dashboard-selects flex justify-center'>
                <select
                    className='dashboard-chooseteam-select-mobile'
                    value={showPlaceholder ? '' : selectedTeam}
                    onChange={(e) => {
                        setSelectedTeam(Number(e.target.value));
                        setShowPlaceholder(false);
                    }}
                >
                    <option value="" disabled hidden>Choose team</option>

                    {myTeams.map((team) => (
                        <option key={team.id} value={team.id}>
                            {team.team_name}
                        </option>
                    ))}
                </select>

            </div>

            {/* destop view */}
            <div className='dashboard-chooseteam-buttons justify-center'>
                {myTeams.map((team) => (
                    <DashboardButton
                        key={team.id}
                        text={team.team_name}
                        isActive={selectedTeam === team.id}
                        onClick={() => setSelectedTeam(team.id)}
                    />
                ))}
            </div>
            <div className='dashboard-overview'>

            </div>
            {view === "checkins" && <AllCheckinsView logs={teamLogs} />}
            {view === "dashboard" && <DashboardView
                participationRate={participationPercentage}
                teamCount={totalMembers} 
                logs={teamLogs}
                logsHistory={teamLogsHistory}
                logsCounts={teamLogs.length}
                team={selectedTeam}
                moodOption={moods}
                workloadOption={workloads}
                isLoading={isLoading} />}
        </section>
    )
};

export default DashboardPage;