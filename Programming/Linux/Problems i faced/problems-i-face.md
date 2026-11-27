# Making Desktop Entry
So sometimes in linux when you install application it does not have a shortcut in your apps shortcuts so you have to make a .desktop file here what i made (all this i do for JetBrains Rider):

## 1- Desktop entry file
First Thing you need to make is desktop entry file in `local/share/applications`
```bash
nano local/share/applications/rider.desktop
```
and it should be like this
```
[Desktop Entry]
Version=1.0
Type=Application
Name=JetBrains Rider
GenericName=.NET IDE
Comment=JetBrains Rider IDE
Exec="/home/remando/Programs/JetBrains Rider-2026.3.0.2/bin/rider.sh" %f
Icon=/home/remando/Programs/JetBrains Rider-2026.3.0.2/bin/rider.svg
Terminal=false
Categories=Development;IDE;
StartupNotify=true
StartupWMClass=jetbrains-rider
MimeType=application/x-sln;
```
## 2- Assure file permissions
it should have permissions like `-rwxr-xr-x` run this command to check:
```bash
ls -l
```
if its not then you need to use `chmod`
```
chmod +x ~/.local/share/applications/rider.desktop
```
this change file permissions thats what `chmod` do, `rwx` mean he have permissions to do
- Read = `r`
- Write = `w`
- Execute = `x`
## 3- Update Desktop Database
you need make sure your linux can see the new Desktop Entry file you made run:
```bash
update-desktop-database ~/.local/share/applications
```
## 4- Test the launcher
```bash
gtk-launch rider
```
