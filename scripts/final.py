# Input names and times (with verification)
for i in range(200):
    MemberName[i] = input("Enter the Name")

    Time1 = int(input("Enter the Time"))
    Time2 = int(input("Re-enter the Time"))

    while Time1 != Time2:
        print("Times do not match, try again")
        Time1 = int(input("Enter the Time"))
        Time2 = int(input("Re-enter the Time"))

    MemberTime[i] = Time1


# Sort times and names together (ascending order)
for Pass in range(199):
    for index in range(199 - Pass):

        if MemberTime[index] > MemberTime[index + 1]:

            Temp = MemberTime[index]
            MemberTime[index] = MemberTime[index + 1]
            MemberTime[index + 1] = Temp

            Temp = MemberName[index]
            MemberName[index] = MemberName[index + 1]
            MemberName[index + 1] = Temp


# Output top three runners
print("First Place:", MemberName[0], MemberTime[0])
print("Second Place:", MemberName[1], MemberTime[1])
print("Third Place:", MemberName[2], MemberTime[2])


# Store certificate winners
CertificateCount = 0

for i in range(200):
    if MemberTime[i] < 240:
        MemberCertificate[CertificateCount] = MemberName[i]
        CertificateCount = CertificateCount + 1


# Output certificate count
print("Number of certificates to print:", CertificateCount)