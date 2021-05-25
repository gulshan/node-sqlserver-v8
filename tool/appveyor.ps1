[reflection.assembly]::LoadWithPartialName("Microsoft.SqlServer.Smo") | Out-Null;
[reflection.assembly]::LoadWithPartialName("Microsoft.SqlServer.SqlWmiManagement") | Out-Null;

Get-Service MSSQL* | Write-Output

$instancename = $args[0];

$wmi = New-Object -TypeName Microsoft.SqlServer.Management.Smo.Wmi.ManagedComputer  
$tcp = $wmi.GetSmoObject("ManagedComputer[@Name='${env:computername}']/ServerInstance[@Name='${instancename}']/ServerProtocol[@Name='Tcp']");
$tcp.IsEnabled = $true;
$tcp.Alter();

Start-Service -Name "MSSQL`$$instancename";

$ipall = $wmi.GetSmoObject("ManagedComputer[@Name='${env:computername}']/ServerInstance[@Name='${instancename}']/ServerProtocol[@Name='Tcp']/IPAddress[@Name='IPAll']");
$port = $ipall.IPAddressProperties.Item("TcpDynamicPorts").Value;
